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
                title: 'Character Builders: Essential Life Values for Kids',
                description: 'A character education course designed for children that teaches important life values such as kindness, honesty, responsibility, respect, perseverance, empathy, gratitude, courage, integrity, and humility through engaging stories and activities.',
                shortDescription: 'Learn kindness, honesty, courage, gratitude, and responsibility through engaging stories.',
                category: 'Values',
                level: 'beginner',
                price: 500,
                discountPrice: 500,
                instructor: 'Santhosh Ram',
                duration: '10 Lessons',
                thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
            }
        ];

        for (const c of courses) {
            const course = await Course.create(c);

            // Add lessons based on course title
            let lessons = [];
            if (c.title === 'Character Builders: Essential Life Values for Kids') {
                const values = [
                    'Kindness', 'Honesty', 'Responsibility', 'Respect', 'Perseverance',
                    'Empathy', 'Gratitude', 'Courage', 'Integrity', 'Humility'
                ];
                lessons = values.map((val, idx) => ({
                    title: val,
                    content: `<h3>Exploring ${val}</h3><p>This lesson teaches children about the importance of ${val.toLowerCase()} in their daily lives through stories and interactive play.</p>`,
                    isFree: idx === 0, // First one free
                    order: idx + 1,
                    courseId: course._id
                }));
            } else {
                lessons = [
                    { title: 'Introduction to the Course', content: 'In this lesson we cover the basics.', isFree: true, order: 1, courseId: course._id },
                    { title: 'Setting up Environment', content: 'Install Node.js and VS Code.', isFree: false, order: 2, courseId: course._id },
                    { title: 'Your First Project', content: 'Building a simple Hello World.', isFree: false, order: 3, courseId: course._id }
                ];
            }

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
