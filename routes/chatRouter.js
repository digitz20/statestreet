const router = require('express').Router()

const {
    createConversation,
    getUserConversations,
    getConversationById,
    sendMessage,
    getAdminConversations,
    assignConversation,
    updateConversationStatus,
    addConversationTags,
    getChatStats,
    markMessagesAsRead
} = require('../controller/chatController')

const { authenticate } = require('../middlewares/authentication')
const { authenticateAdmin } = require('../middlewares/adminAuth')


router.post('/conversations', authenticate, createConversation)
router.get('/conversations', authenticate, getUserConversations)
router.get('/conversations/:id', authenticate, getConversationById)
router.post('/conversations/:id/messages', authenticate, sendMessage)
router.post('/conversations/:id/read', authenticate, markMessagesAsRead)

router.get('/admin/conversations', authenticateAdmin, getAdminConversations)
router.get('/admin/stats', authenticateAdmin, getChatStats)
router.post('/admin/conversations/:id/assign', authenticateAdmin, assignConversation)
router.patch('/admin/conversations/:id/status', authenticateAdmin, updateConversationStatus)
router.post('/admin/conversations/:id/tags', authenticateAdmin, addConversationTags)

module.exports = router