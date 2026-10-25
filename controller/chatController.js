const { Conversation, Message } = require('../model/chat')
const userModel = require('../model/user')

exports.createConversation = async (req, res) => {
    try {
        const { subject, priority, message } = req.body
        const userId = req.user._id

        let conversation = await Conversation.findOne({ 
            user: userId, 
            status: { $in: ['open', 'pending'] } 
        }).sort({ createdAt: -1 })

        if (!conversation) {
            conversation = new Conversation({
                user: userId,
                subject: subject || 'General Support',
                priority: priority || 'medium',
                status: 'open',
                unreadCount: { user: 0, admin: 1 }
            })
            await conversation.save()
        }

        if (message) {
            const newMessage = new Message({
                conversation: conversation._id,
                sender: userId,
                senderType: 'user',
                content: message,
                messageType: 'text'
            })
            await newMessage.save()

            conversation.lastMessage = message
            conversation.lastMessageAt = new Date()
            conversation.unreadCount.admin += 1
            await conversation.save()
        }

        const populatedConversation = await Conversation.findById(conversation._id)
            .populate('user', 'fullName email username avatar')
            .populate('admin', 'fullName email username avatar')

        res.status(201).json({ 
            message: 'Conversation created successfully', 
            data: populatedConversation 
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error creating conversation', error: error.message })
    }
}

exports.getUserConversations = async (req, res) => {
    try {
        const userId = req.user._id
        const { status, page = 1, limit = 20 } = req.query

        const query = { user: userId }
        if (status) query.status = status

        const conversations = await Conversation.find(query)
            .populate('admin', 'fullName email username avatar')
            .sort({ lastMessageAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))

        const total = await Conversation.countDocuments(query)

        res.status(200).json({
            message: 'Conversations retrieved successfully',
            data: conversations,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalConversations: total
            }
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error retrieving conversations', error: error.message })
    }
}

exports.getConversationById = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        const conversation = await Conversation.findById(id)
            .populate('user', 'fullName email username avatar')
            .populate('admin', 'fullName email username avatar')
            .populate('assignedAdmin', 'fullName email username avatar')

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' })
        }

        if (conversation.user._id.toString() !== userId.toString() && 
            (!conversation.admin || conversation.admin._id.toString() !== userId.toString())) {
            return res.status(403).json({ message: 'Access denied' })
        }

        const messages = await Message.find({ conversation: id })
            .populate('sender', 'fullName email username avatar')
            .sort({ createdAt: 1 })

        await Message.updateMany(
            { conversation: id, sender: { $ne: userId }, isRead: false },
            { isRead: true, readAt: new Date() }
        )

        if (conversation.user._id.toString() === userId.toString()) {
            conversation.unreadCount.user = 0
        } else {
            conversation.unreadCount.admin = 0
        }
        await conversation.save()

        res.status(200).json({
            message: 'Conversation retrieved successfully',
            data: { conversation, messages }
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error retrieving conversation', error: error.message })
    }
}

exports.sendMessage = async (req, res) => {
    try {
        const { id } = req.params
        const { content, messageType, fileUrl, fileName } = req.body
        const userId = req.user._id

        const conversation = await Conversation.findById(id)
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' })
        }

        if (conversation.status === 'closed' || conversation.status === 'archived') {
            return res.status(400).json({ message: 'Cannot send message to closed conversation' })
        }

        const isUser = conversation.user._id.toString() === userId.toString()
        const isAdmin = conversation.admin && conversation.admin._id.toString() === userId.toString()

        if (!isUser && !isAdmin) {
            return res.status(403).json({ message: 'Access denied' })
        }

        const senderType = isUser ? 'user' : 'admin'

        const newMessage = new Message({
            conversation: id,
            sender: userId,
            senderType,
            content,
            messageType: messageType || 'text',
            fileUrl,
            fileName
        })
        await newMessage.save()

        conversation.lastMessage = content
        conversation.lastMessageAt = new Date()
        
        if (isUser) {
            conversation.unreadCount.admin += 1
            conversation.status = 'open'
        } else {
            conversation.unreadCount.user += 1
            if (conversation.status === 'open') {
                conversation.status = 'pending'
            }
        }
        await conversation.save()

        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'fullName email username avatar')

        res.status(201).json({ 
            message: 'Message sent successfully', 
            data: populatedMessage 
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error sending message', error: error.message })
    }
}

exports.getAdminConversations = async (req, res) => {
    try {
        const { status, priority, assigned, page = 1, limit = 20, search } = req.query

        const query = {}
        if (status) query.status = status
        if (priority) query.priority = priority
        if (assigned === 'me') query.assignedAdmin = req.admin._id
        if (assigned === 'unassigned') query.assignedAdmin = { $exists: false }

        if (search) {
            const users = await userModel.find({
                $or: [
                    { fullName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { username: { $regex: search, $options: 'i' } }
                ]
            }).select('_id')
            const userIds = users.map(u => u._id)
            query.$or = [
                { user: { $in: userIds } },
                { subject: { $regex: search, $options: 'i' } }
            ]
        }

        const conversations = await Conversation.find(query)
            .populate('user', 'fullName email username avatar isVerified')
            .populate('admin', 'fullName email username avatar')
            .populate('assignedAdmin', 'fullName email username avatar')
            .sort({ lastMessageAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))

        const total = await Conversation.countDocuments(query)

        const stats = await Conversation.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ])

        res.status(200).json({
            message: 'Admin conversations retrieved successfully',
            data: conversations,
            stats,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalConversations: total
            }
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error retrieving conversations', error: error.message })
    }
}

exports.assignConversation = async (req, res) => {
    try {
        const { id } = req.params
        const { adminId } = req.body

        const conversation = await Conversation.findById(id)
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' })
        }

        if (adminId) {
            const admin = await userModel.findById(adminId)
            if (!admin || !['admin', 'superadmin'].includes(admin.role)) {
                return res.status(400).json({ message: 'Invalid admin user' })
            }
            conversation.admin = adminId
            conversation.assignedAdmin = adminId
        } else {
            conversation.admin = req.admin._id
            conversation.assignedAdmin = req.admin._id
        }

        if (conversation.status === 'open') {
            conversation.status = 'pending'
        }

        await conversation.save()

        const populated = await Conversation.findById(id)
            .populate('user', 'fullName email username avatar')
            .populate('admin', 'fullName email username avatar')
            .populate('assignedAdmin', 'fullName email username avatar')

        res.status(200).json({ message: 'Conversation assigned successfully', data: populated })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error assigning conversation', error: error.message })
    }
}

exports.updateConversationStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const conversation = await Conversation.findById(id)
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' })
        }

        const validStatuses = ['open', 'pending', 'closed', 'archived']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' })
        }

        conversation.status = status
        if (status === 'closed') {
            conversation.closedAt = new Date()
            conversation.closedBy = req.admin._id
        }
        await conversation.save()

        const populated = await Conversation.findById(id)
            .populate('user', 'fullName email username avatar')
            .populate('admin', 'fullName email username avatar')
            .populate('assignedAdmin', 'fullName email username avatar')

        res.status(200).json({ message: 'Conversation status updated', data: populated })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error updating conversation status', error: error.message })
    }
}

exports.addConversationTags = async (req, res) => {
    try {
        const { id } = req.params
        const { tags } = req.body

        const conversation = await Conversation.findByIdAndUpdate(
            id,
            { $addToSet: { tags: { $each: tags } } },
            { new: true }
        ).populate('user', 'fullName email username avatar')

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' })
        }

        res.status(200).json({ message: 'Tags added successfully', data: conversation })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error adding tags', error: error.message })
    }
}

exports.getChatStats = async (req, res) => {
    try {
        const totalConversations = await Conversation.countDocuments()
        const openConversations = await Conversation.countDocuments({ status: 'open' })
        const pendingConversations = await Conversation.countDocuments({ status: 'pending' })
        const closedConversations = await Conversation.countDocuments({ status: 'closed' })

        const avgResponseTime = await Conversation.aggregate([
            { $match: { status: { $in: ['pending', 'closed'] }, admin: { $exists: true } } },
            { $project: { responseTime: { $subtract: ['$closedAt', '$createdAt'] } } },
            { $group: { _id: null, avg: { $avg: '$responseTime' } } }
        ])

        const conversationsByPriority = await Conversation.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ])

        const messagesToday = await Message.countDocuments({
            createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        })

        res.status(200).json({
            message: 'Chat statistics retrieved',
            data: {
                conversations: {
                    total: totalConversations,
                    open: openConversations,
                    pending: pendingConversations,
                    closed: closedConversations
                },
                avgResponseTimeMs: avgResponseTime[0]?.avg || 0,
                conversationsByPriority,
                messagesToday
            }
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error retrieving chat stats', error: error.message })
    }
}

exports.markMessagesAsRead = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        const conversation = await Conversation.findById(id)
        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' })
        }

        const isUser = conversation.user.toString() === userId.toString()
        const isAdmin = conversation.admin && conversation.admin.toString() === userId.toString()

        if (!isUser && !isAdmin) {
            return res.status(403).json({ message: 'Access denied' })
        }

        await Message.updateMany(
            { conversation: id, sender: { $ne: userId }, isRead: false },
            { isRead: true, readAt: new Date() }
        )

        if (isUser) {
            conversation.unreadCount.user = 0
        } else {
            conversation.unreadCount.admin = 0
        }
        await conversation.save()

        res.status(200).json({ message: 'Messages marked as read' })
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error marking messages as read', error: error.message })
    }
}