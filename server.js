require('./config/database')
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
require('dotenv').config()
const cors = require('cors')
const swaggerUIEXPRESS = require('swagger-ui-express');
const swaggerJSDOC = require('swagger-jsdoc');
// Start the real-time trade settlement worker
require('./utils/tradeSettlementWorker');


const PORT = process.env.PORT || 4988

const userRouter = require('./routes/userRouter')
const transactionRouter = require('./routes/transactionRouter')
const dashboardRouter = require('./routes/dashboardRouter')
const coinGeckoRouter = require('./routes/coinGeckoRouter')
const adminRouter = require('./routes/adminRouter')
const chatRouter = require('./routes/chatRouter')


const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

// Socket.io connection handling
const userSockets = new Map()
const adminSockets = new Set()

io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('authenticate', async (token) => {
        try {
            const jwt = require('jsonwebtoken')
            const userModel = require('./model/user')
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await userModel.findById(decoded.userId)
            
            if (user) {
                socket.userId = user._id.toString()
                socket.userRole = user.role
                userSockets.set(user._id.toString(), socket.id)
                
                if (['admin', 'superadmin'].includes(user.role)) {
                    adminSockets.add(socket.id)
                    socket.join('admins')
                }
                
                socket.join(`user_${user._id}`)
                console.log(`User authenticated: ${user.email} (${user.role})`)
                socket.emit('authenticated', { success: true, user: { id: user._id, role: user.role } })
            } else {
                socket.emit('authenticated', { success: false, message: 'User not found' })
            }
        } catch (error) {
            console.error('Socket auth error:', error.message)
            socket.emit('authenticated', { success: false, message: 'Invalid token' })
        }
    })

    socket.on('join_conversation', (conversationId) => {
        socket.join(`conversation_${conversationId}`)
        console.log(`Socket ${socket.id} joined conversation ${conversationId}`)
    })

    socket.on('leave_conversation', (conversationId) => {
        socket.leave(`conversation_${conversationId}`)
    })

    socket.on('send_message', async (data) => {
        try {
            const { conversationId, content, messageType, fileUrl, fileName } = data
            const { Conversation, Message } = require('./model/chat')
            
            const conversation = await Conversation.findById(conversationId)
            if (!conversation) {
                socket.emit('message_error', { message: 'Conversation not found' })
                return
            }

            const isUser = conversation.user.toString() === socket.userId
            const isAdmin = conversation.admin && conversation.admin.toString() === socket.userId
            
            if (!isUser && !isAdmin && socket.userRole !== 'admin' && socket.userRole !== 'superadmin') {
                socket.emit('message_error', { message: 'Access denied' })
                return
            }

            const senderType = isUser ? 'user' : 'admin'

            const newMessage = new Message({
                conversation: conversationId,
                sender: socket.userId,
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

            io.to(`conversation_${conversationId}`).emit('new_message', populatedMessage)
            
            if (isUser) {
                io.to('admins').emit('conversation_update', {
                    conversationId,
                    lastMessage: content,
                    lastMessageAt: new Date(),
                    unreadCount: conversation.unreadCount.admin
                })
            } else {
                io.to(`user_${conversation.user}`).emit('conversation_update', {
                    conversationId,
                    lastMessage: content,
                    lastMessageAt: new Date(),
                    unreadCount: conversation.unreadCount.user
                })
            }
        } catch (error) {
            console.error('Send message error:', error.message)
            socket.emit('message_error', { message: 'Error sending message' })
        }
    })

    socket.on('mark_read', async (data) => {
        try {
            const { conversationId } = data
            const { Conversation, Message } = require('./model/chat')
            
            const conversation = await Conversation.findById(conversationId)
            if (!conversation) return

            const isUser = conversation.user.toString() === socket.userId
            const isAdmin = conversation.admin && conversation.admin.toString() === socket.userId

            if (!isUser && !isAdmin) return

            await Message.updateMany(
                { conversation: conversationId, sender: { $ne: socket.userId }, isRead: false },
                { isRead: true, readAt: new Date() }
            )

            if (isUser) {
                conversation.unreadCount.user = 0
            } else {
                conversation.unreadCount.admin = 0
            }
            await conversation.save()

            io.to(`conversation_${conversationId}`).emit('messages_read', { conversationId, readBy: socket.userId })
        } catch (error) {
            console.error('Mark read error:', error.message)
        }
    })

    socket.on('typing', (data) => {
        const { conversationId, isTyping } = data
        socket.to(`conversation_${conversationId}`).emit('user_typing', {
            userId: socket.userId,
            isTyping
        })
    })

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
        if (socket.userId) {
            userSockets.delete(socket.userId)
        }
        adminSockets.delete(socket.id)
    })
})

// Make io accessible to controllers
app.set('io', io)

app.use(cors({origin: "*"}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log ALL requests to debug deposit issues (AFTER body parsing)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  // Log body if it exists
  if (Object.keys(req.body || {}).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});


// Swagger Definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'statestreet Documentation',
    version: '1.0.0',
    description: 'This is a swagger documentation for the web application statestreet',
    license: {
      name: 
      'Base_URL: https://added-desiree-webtool-a80f54c4.koyeb.app/',
    },
  },
  "components": {
 "securitySchemes": {
    "bearerAuth": {
      "type": 'http',
      "scheme": 'bearer',
      "bearerFormat": 'JWT',
    },
  },
},

security: [
  {
    bearerAuth: [],
  },
],
  servers: [
    {
      url: 'https://added-desiree-webtool-a80f54c4.koyeb.app/',
      description: 'Production server',
    },
    {
      url: 'http://localhost:4988',
      description: 'Development server',
    },
  ],


};


// Swagger Options
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Adjust this path based on your actual route files
};

const swaggerSpec = swaggerJSDOC(options);

// Swagger UI setup
app.use('/statestreet', swaggerUIEXPRESS.serve, swaggerUIEXPRESS.setup(swaggerSpec));


app.use('/api/v1/',userRouter)
app.use('/api/v1/',transactionRouter)
app.use('/api/v1/',dashboardRouter)
app.use('/api/v1/',coinGeckoRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/chat', chatRouter)



// Error handling middleware - properly handle multer errors
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  
  // Handle multer errors specifically
  if (error instanceof Error && error.name === 'MulterError') {
    return res.status(400).json({ 
      message: 'File upload error: ' + error.message 
    });
  }
  
  // Handle other errors
  if (error) {
     return res.status(400).json({message: error.message});
  }
  next();
})


server.listen(PORT, () => {
    console.log(`my server is running on port ${PORT}`)
})