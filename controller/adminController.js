const userModel = require('../model/user')
const dashboardModel = require('../model/dashboard')
const transactionModel = require('../model/transaction')
const planModel = require('../model/plan')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, role, isActive, sortBy = 'createdAt', sortOrder = 'desc' } = req.query
        
        const query = {}
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } }
            ]
        }
        if (role) query.role = role
        if (isActive !== undefined) query.isActive = isActive === 'true'

        const sort = {}
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1

        const users = await userModel.find(query)
            .select('-password')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))

        const total = await userModel.countDocuments(query)

        res.status(200).json({
            message: 'Users retrieved successfully',
            data: users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalUsers: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error retrieving users', error: error.message })
    }
}

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await userModel.findById(id).select('-password')
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const dashboard = await dashboardModel.findOne({ user: id })
        const transactions = await transactionModel.find({ user: id }).sort({ createdAt: -1 }).limit(10)

        res.status(200).json({
            message: 'User retrieved successfully',
            data: { user, dashboard, recentTransactions: transactions }
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error retrieving user', error: error.message })
    }
}

exports.createUser = async (req, res) => {
    try {
        const { fullName, username, email, password, accountType, country, currency, role, isVerified, isActive } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const existingUser = await userModel.findOne({ email: email.toLowerCase() })
        if (existingUser) {
            return res.status(400).json({ message: `User with email: ${email} already exists` })
        }

        if (username) {
            const existingUsername = await userModel.findOne({ username })
            if (existingUsername) {
                return res.status(400).json({ message: `Username: ${username} already taken` })
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const newUser = new userModel({
            fullName,
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
            accountType: accountType || 'Individual',
            country: country || 'US',
            currency: currency || 'USD',
            role: role || 'user',
            isVerified: isVerified || false,
            isActive: isActive !== undefined ? isActive : true
        })

        await newUser.save()

        const dashboard = new dashboardModel({
            user: newUser._id,
            username: newUser.username,
            balance: 0,
            totalDeposit: 0,
            transaction: []
        })
        await dashboard.save()

        const userResponse = newUser.toObject()
        delete userResponse.password

        res.status(201).json({ message: 'User created successfully', data: userResponse })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error creating user', error: error.message })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { fullName, username, email, accountType, country, currency, role, isVerified, isActive, phoneNumber, address, avatar } = req.body

        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (req.admin.role === 'admin' && user.role === 'superadmin') {
            return res.status(403).json({ message: 'Cannot modify superadmin user' })
        }

        if (email && email.toLowerCase() !== user.email) {
            const existingEmail = await userModel.findOne({ email: email.toLowerCase() })
            if (existingEmail) {
                return res.status(400).json({ message: 'Email already in use' })
            }
        }

        if (username && username !== user.username) {
            const existingUsername = await userModel.findOne({ username })
            if (existingUsername) {
                return res.status(400).json({ message: 'Username already taken' })
            }
        }

        const updateData = {}
        if (fullName) updateData.fullName = fullName
        if (username) updateData.username = username
        if (email) updateData.email = email.toLowerCase()
        if (accountType) updateData.accountType = accountType
        if (country) updateData.country = country
        if (currency) updateData.currency = currency
        if (role) {
            if (req.admin.role !== 'superadmin' && role === 'superadmin') {
                return res.status(403).json({ message: 'Only superadmin can assign superadmin role' })
            }
            updateData.role = role
        }
        if (isVerified !== undefined) updateData.isVerified = isVerified
        if (isActive !== undefined) updateData.isActive = isActive
        if (phoneNumber) updateData.phoneNumber = phoneNumber
        if (address) updateData.address = address
        if (avatar) updateData.avatar = avatar

        const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true }).select('-password')

        if (dashboardModel) {
            await dashboardModel.findOneAndUpdate({ user: id }, { username: updateData.username || user.username })
        }

        res.status(200).json({ message: 'User updated successfully', data: updatedUser })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error updating user', error: error.message })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (req.admin.role === 'admin' && user.role === 'superadmin') {
            return res.status(403).json({ message: 'Cannot delete superadmin user' })
        }

        if (user._id.toString() === req.admin._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own account' })
        }

        await dashboardModel.deleteMany({ user: id })
        await transactionModel.deleteMany({ user: id })
        await userModel.findByIdAndDelete(id)

        res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error deleting user', error: error.message })
    }
}

exports.toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { isActive } = req.body

        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (req.admin.role === 'admin' && user.role === 'superadmin') {
            return res.status(403).json({ message: 'Cannot modify superadmin user' })
        }

        user.isActive = isActive
        await user.save()

        res.status(200).json({ message: `User ${isActive ? 'activated' : 'deactivated'} successfully`, data: user })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error toggling user status', error: error.message })
    }
}

exports.resetUserPassword = async (req, res) => {
    try {
        const { id } = req.params
        const { newPassword } = req.body

        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' })
        }

        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (req.admin.role === 'admin' && user.role === 'superadmin') {
            return res.status(403).json({ message: 'Cannot reset superadmin password' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12)
        user.password = hashedPassword
        await user.save()

        res.status(200).json({ message: 'Password reset successfully' })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error resetting password', error: error.message })
    }
}

exports.getSiteStats = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments()
        const activeUsers = await userModel.countDocuments({ isActive: true })
        const verifiedUsers = await userModel.countDocuments({ isVerified: true })
        const adminUsers = await userModel.countDocuments({ role: { $in: ['admin', 'superadmin'] } })
        
        const totalDeposits = await dashboardModel.aggregate([
            { $group: { _id: null, total: { $sum: '$totalDeposit' } } }
        ])
        
        const totalBalance = await dashboardModel.aggregate([
            { $group: { _id: null, total: { $sum: '$balance' } } }
        ])

        const recentUsers = await userModel.find().sort({ createdAt: -1 }).limit(5).select('fullName email username createdAt isVerified role')
        const usersByRole = await userModel.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ])
        const usersByCountry = await userModel.aggregate([
            { $group: { _id: '$country', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ])

        res.status(200).json({
            message: 'Site statistics retrieved successfully',
            data: {
                users: {
                    total: totalUsers,
                    active: activeUsers,
                    verified: verifiedUsers,
                    admins: adminUsers
                },
                financial: {
                    totalDeposits: totalDeposits[0]?.total || 0,
                    totalBalance: totalBalance[0]?.total || 0
                },
                recentUsers,
                usersByRole,
                usersByCountry
            }
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error retrieving site stats', error: error.message })
    }
}

exports.getAllTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 20, type, status, userId, startDate, endDate } = req.query
        
        const query = {}
        if (type) query.type = type
        if (status) query.status = status
        if (userId) query.user = userId
        if (startDate || endDate) {
            query.createdAt = {}
            if (startDate) query.createdAt.$gte = new Date(startDate)
            if (endDate) query.createdAt.$lte = new Date(endDate)
        }

        const transactions = await transactionModel.find(query)
            .populate('user', 'fullName email username')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))

        const total = await transactionModel.countDocuments(query)

        res.status(200).json({
            message: 'Transactions retrieved successfully',
            data: transactions,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalTransactions: total
            }
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error retrieving transactions', error: error.message })
    }
}

exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params
        const { status, adminNote } = req.body

        const transaction = await transactionModel.findByIdAndUpdate(
            id,
            { status, adminNote, processedAt: new Date(), processedBy: req.admin._id },
            { new: true }
        ).populate('user', 'fullName email username')

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' })
        }

        res.status(200).json({ message: 'Transaction updated successfully', data: transaction })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error updating transaction', error: error.message })
    }
}

exports.getAllPlans = async (req, res) => {
    try {
        const plans = await planModel.find().sort({ createdAt: -1 })
        res.status(200).json({ message: 'Plans retrieved successfully', data: plans })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error retrieving plans', error: error.message })
    }
}

exports.createPlan = async (req, res) => {
    try {
        const plan = new planModel(req.body)
        await plan.save()
        res.status(201).json({ message: 'Plan created successfully', data: plan })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error creating plan', error: error.message })
    }
}

exports.updatePlan = async (req, res) => {
    try {
        const { id } = req.params
        const plan = await planModel.findByIdAndUpdate(id, req.body, { new: true })
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' })
        }
        res.status(200).json({ message: 'Plan updated successfully', data: plan })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error updating plan', error: error.message })
    }
}

exports.deletePlan = async (req, res) => {
    try {
        const { id } = req.params
        const plan = await planModel.findByIdAndDelete(id)
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' })
        }
        res.status(200).json({ message: 'Plan deleted successfully' })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error deleting plan', error: error.message })
    }
}

exports.createAdmin = async (req, res) => {
    try {
        if (req.admin.role !== 'superadmin') {
            return res.status(403).json({ message: 'Only superadmin can create admin users' })
        }

        const { fullName, username, email, password, role = 'admin' } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        if (!['admin', 'superadmin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be admin or superadmin' })
        }

        const existingUser = await userModel.findOne({ email: email.toLowerCase() })
        if (existingUser) {
            return res.status(400).json({ message: `User with email: ${email} already exists` })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const newAdmin = new userModel({
            fullName,
            username,
            email: email.toLowerCase(),
            password: hashedPassword,
            accountType: 'Individual',
            country: 'US',
            currency: 'USD',
            role,
            isVerified: true,
            isActive: true
        })

        await newAdmin.save()

        const adminResponse = newAdmin.toObject()
        delete adminResponse.password

        res.status(201).json({ message: 'Admin created successfully', data: adminResponse })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error creating admin', error: error.message })
    }
}

exports.getAdminProfile = async (req, res) => {
    try {
        const admin = await userModel.findById(req.admin._id).select('-password')
        res.status(200).json({ message: 'Admin profile retrieved', data: admin })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error retrieving admin profile', error: error.message })
    }
}