const router = require('express').Router()

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetUserPassword,
    getSiteStats,
    getAllTransactions,
    updateTransaction,
    getAllPlans,
    createPlan,
    updatePlan,
    deletePlan,
    createAdmin,
    getAdminProfile,
    adminLogin
} = require('../controller/adminController')

const { authenticateAdmin, authenticateSuperAdmin } = require('../middlewares/adminAuth')


router.post('/login', adminLogin)

router.get('/profile', authenticateAdmin, getAdminProfile)

router.post('/create-admin', authenticateSuperAdmin, createAdmin)

router.get('/stats', authenticateAdmin, getSiteStats)

router.get('/users', authenticateAdmin, getAllUsers)
router.get('/users/:id', authenticateAdmin, getUserById)
router.post('/users', authenticateAdmin, createUser)
router.put('/users/:id', authenticateAdmin, updateUser)
router.delete('/users/:id', authenticateAdmin, deleteUser)
router.patch('/users/:id/status', authenticateAdmin, toggleUserStatus)
router.post('/users/:id/reset-password', authenticateAdmin, resetUserPassword)

router.get('/transactions', authenticateAdmin, getAllTransactions)
router.put('/transactions/:id', authenticateAdmin, updateTransaction)

router.get('/plans', authenticateAdmin, getAllPlans)
router.post('/plans', authenticateAdmin, createPlan)
router.put('/plans/:id', authenticateAdmin, updatePlan)
router.delete('/plans/:id', authenticateAdmin, deletePlan)

module.exports = router