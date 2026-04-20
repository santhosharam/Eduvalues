const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Course title is required'], trim: true },
    slug: { type: String, unique: true, trim: true },
    description: { type: String, required: [true, 'Description is required'], trim: true },
    shortDescription: { type: String, trim: true },
    thumbnail: { type: String, trim: true },
    category: { type: String, required: [true, 'Category is required'], trim: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    price: { type: Number, default: 0, min: 0 },
    discountPrice: { type: Number, min: 0 },
    instructor: { type: String, required: [true, 'Instructor name is required'], trim: true },
    duration: { type: String, trim: true },
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    isPublished: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    finalQuiz: [{
        question: { type: String, required: true, trim: true },
        options: [{
            text: { type: String, required: true, trim: true },
            correct: { type: Boolean, default: false },
        }]
    }]
}, { timestamps: true })
courseSchema.pre('save', async function () {
    if (!this.slug && this.title) {
        this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
})

module.exports = mongoose.model('Course', courseSchema)
