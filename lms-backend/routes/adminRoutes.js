const express = require('express')
const router = express.Router()
const { getStats, getStudents, deleteStudent } = require('../controllers/adminController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.use(protect, adminOnly) // All admin routes require auth + admin role

router.get('/stats', getStats)
router.get('/students', getStudents)
router.delete('/students/:id', deleteStudent)

module.exports = router
