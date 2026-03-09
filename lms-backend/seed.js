const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Course.deleteMany();
        await Lesson.deleteMany();

        // 1. Create Admin
        const admin = await User.create({
            name: 'Site Administrator',
            email: 'admin@learnhub.com',
            password: 'password123',
            role: 'admin'
        });

        // 2. Create Student
        const student = await User.create({
            name: 'John Student',
            email: 'student@example.com',
            password: 'password123',
            role: 'student'
        });

        // 3. Create Courses
        const courses = [
            {
                title: 'Complete Web Development Bootcamp 2024',
                description: 'Learn HTML, CSS, JS, React, Node and MongoDB from scratch. This comprehensive course covers everything you need to become a full-stack developer.',
                shortDescription: 'Master modern full-stack web development.',
                category: 'Development',
                level: 'beginner',
                price: 4999,
                discountPrice: 499,
                instructor: 'Dr. Angela Yu',
                duration: '65h',
                thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
            },
            {
                title: 'Mastering UI/UX Design with Figma',
                description: 'Design beautiful, user-centered interfaces. Learn typography, color theory, and advanced prototyping in Figma.',
                shortDescription: 'Learn professional UI/UX design patterns.',
                category: 'Design',
                level: 'intermediate',
                price: 2999,
                discountPrice: 299,
                instructor: 'Gary Simon',
                duration: '12h',
                thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563cc4c?auto=format&fit=crop&w=800&q=80',
            }
        ];

        for (const c of courses) {
            const course = await Course.create(c);

            // Add a few lessons to each
            const lessons = [
                { title: 'Introduction to the Course', content: 'In this lesson we cover the basics.', isFree: true, order: 1, course: course._id },
                { title: 'Setting up Environment', content: 'Install Node.js and VS Code.', isFree: false, order: 2, course: course._id },
                { title: 'Your First Project', content: 'Building a simple Hello World.', isFree: false, order: 3, course: course._id }
            ];

            const createdLessons = await Lesson.insertMany(lessons);
            course.lessons = createdLessons.map(l => l._id);
            await course.save();
        }

        console.log('✅ Database seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('❌ Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
