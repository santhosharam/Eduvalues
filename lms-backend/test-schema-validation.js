const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const runTests = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI === 'memory' ? 'mongodb://localhost:27017/lms_test' : process.env.MONGO_URI);
        console.log('--- NEGATIVE TESTING: SCHEMA VALIDATION ---');

        // Test 1: Create Lesson without courseId
        try {
            await Lesson.create({ title: 'Test Lesson' });
            console.log('❌ TEST 1 FAILED: Lesson created without courseId!');
        } catch (err) {
            if (err.errors && err.errors.courseId) {
                console.log('✅ TEST 1 PASSED: courseId is strictly required.');
            } else {
                console.log('❌ TEST 1 FAILED: Unexpected error:', err.message);
            }
        }

        // Test 2: Create Lesson with invalid type
        try {
            await Lesson.create({ title: 'Test Lesson', courseId: 'invalid-id' });
            console.log('❌ TEST 2 FAILED: Lesson created with invalid courseId type!');
        } catch (err) {
            if (err.name === 'ValidationError' || err.name === 'CastError') {
                console.log('✅ TEST 2 PASSED: Invalid courseId type rejected.');
            } else {
                console.log('❌ TEST 2 FAILED: Unexpected error:', err.message);
            }
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Testing failed:', err);
    }
};

runTests();
