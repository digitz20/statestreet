const userModel = require('../model/user')
const jwt = require('jsonwebtoken')


exports.authenticateAdmin = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(401).json({
                message: 'Authorization token not found'
            })
        }
        const token = auth.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                message: 'Invalid Token'
            })
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decodedToken.userId)

        if (!user) {
            return res.status(401).json({
                message: 'Authentication failed: user not found'
            })
        }

        if (!['admin', 'superadmin'].includes(user.role)) {
            return res.status(403).json({
                message: 'Access denied: Admin privileges required'
            })
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: 'Account is deactivated'
            })
        }

        req.user = user
        req.admin = user

        next()
    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: 'Session timeout: Please Login To Continue'
            })
        }
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}

exports.authenticateSuperAdmin = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(401).json({
                message: 'Authorization token not found'
            })
        }
        const token = auth.split(' ')[1]
        if (!token) {
            return res.status(401).json({
                message: 'Invalid Token'
            })
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decodedToken.userId)

        if (!user) {
            return res.status(401).json({
                message: 'Authentication failed: user not found'
            })
        }

        if (user.role !== 'superadmin') {
            return res.status(403).json({
                message: 'Access denied: Super Admin privileges required'
            })
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: 'Account is deactivated'
            })
        }

        req.user = user
        req.admin = user

        next()
    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: 'Session timeout: Please Login To Continue'
            })
        }
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}