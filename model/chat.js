const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    senderType: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    messageType: {
        type: String,
        enum: ['text', 'image', 'file', 'system'],
        default: 'text'
    },
    fileUrl: {
        type: String
    },
    fileName: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    }
}, { timestamps: true })

const conversationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    subject: {
        type: String,
        default: 'General Support'
    },
    status: {
        type: String,
        enum: ['open', 'pending', 'closed', 'archived'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    lastMessage: {
        type: String
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    unreadCount: {
        user: { type: Number, default: 0 },
        admin: { type: Number, default: 0 }
    },
    tags: [{
        type: String
    }],
    assignedAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    closedAt: {
        type: Date
    },
    closedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
}, { timestamps: true })

conversationSchema.index({ user: 1, status: 1 })
conversationSchema.index({ admin: 1, status: 1 })
conversationSchema.index({ lastMessageAt: -1 })

messageSchema.index({ conversation: 1, createdAt: -1 })
messageSchema.index({ sender: 1 })

const Conversation = mongoose.model('Conversation', conversationSchema)
const Message = mongoose.model('Message', messageSchema)

module.exports = { Conversation, Message }