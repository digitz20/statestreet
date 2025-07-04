const userModel = require('../model/user')
const jwt = require('jsonwebtoken')



exports.authenticate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(400).json({
                message: 'token not found'
            })
        }
        const token = auth.split(' ')[1]
        if (!token) {
            return res.status(404).json({
                message: 'Invalid Token'
            })
        }
        const decodedToken =jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decodedToken.userId)

        if (!user) {
            return res.status(400).json({
                message: 'Authentication failed : user not found'
            })
        }
        req.user = user

        next()
    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message: 'Session timeout : Please Login To Continue'
            })
        }
        res.status(500).json({
            message: 'internal server error'
        })
    }
}