const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    thumbnail: { type: String },
    category: { type: String, required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    price: { type: Number, default: 0 },
    discountPrice: { type: Number },
    instructor: { type: String, required: true },
    duration: { type: String },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    isPublished: { type: Boolean, default: true },
    tags: [String],
}, { timestamps: true })
courseSchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
    next()
})

module.exports = mongoose.model('Course', courseSchema)
