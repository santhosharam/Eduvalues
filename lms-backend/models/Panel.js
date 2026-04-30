const mongoose = require('mongoose')

const panelSchema = new mongoose.Schema({
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String
    },
    order: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

panelSchema.index({ lessonId: 1 })

module.exports = mongoose.model('Panel', panelSchema)
