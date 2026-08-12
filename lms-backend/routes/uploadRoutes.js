const express = require('express')
const router = express.Router()
const multer = require('multer')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const { protect, adminOnly } = require('../middleware/authMiddleware')
const supabase = require('../supabaseClient')

// Configure Multer (Memory Storage)
const storage = multer.memoryStorage()

// Validate File Type
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'), false)
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter
})

// POST /api/upload
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' })
        }

        const { courseId, lessonId } = req.body
        const extension = path.extname(req.file.originalname).toLowerCase() || '.webp' // fallback
        const uniqueName = `${uuidv4()}${extension}`
        
        let filePath = ''
        if (courseId && lessonId) {
            filePath = `comics/${courseId}/${lessonId}/${uniqueName}`
        } else {
            filePath = `general/${uniqueName}`
        }

        const { data, error } = await supabase
            .storage
            .from('eduvalues-assets')
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            })

        if (error) {
            console.error('[SUPABASE_UPLOAD_ERROR]', error)
            return res.status(500).json({ 
                message: 'Failed to upload image to storage provider.',
                details: error.message || 'Unknown storage error'
            })
        }

        const { data: publicUrlData } = supabase
            .storage
            .from('eduvalues-assets')
            .getPublicUrl(filePath)

        res.status(201).json({ 
            success: true, 
            url: publicUrlData.publicUrl 
        })
    } catch (err) {
        console.error('[UPLOAD_ERROR]', err)
        // Handle multer errors specifically
        if (err.message.includes('Invalid file type')) {
            return res.status(400).json({ message: err.message })
        }
        res.status(500).json({ message: 'An error occurred during file upload.' })
    }
})

// Handle multer limit errors gracefully
router.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Image must be smaller than 5 MB.' })
        }
        return res.status(400).json({ message: err.message })
    }
    next(err)
})

module.exports = router
