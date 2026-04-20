const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/lms';

const migrate = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB for migration...');

        const collections = [
            'lessons',
            'enrollments',
            'progresses',
            'reviews',
            'certificates',
            'payments'
        ];

        for (const colName of collections) {
            console.log(`Migrating collection: ${colName}...`);
            const collection = mongoose.connection.db.collection(colName);

            // Rename 'course_id' to 'courseId'
            const result1 = await collection.updateMany(
                { course_id: { $exists: true } },
                { $rename: { "course_id": "courseId" } }
            );
            console.log(`  - Renamed 'course_id' to 'courseId' in ${result1.modifiedCount} documents.`);

            // Rename 'course' to 'courseId' (where it's an ID reference, not an object)
            const result2 = await collection.updateMany(
                { course: { $exists: true } },
                { $rename: { "course": "courseId" } }
            );
            console.log(`  - Renamed 'course' to 'courseId' in ${result2.modifiedCount} documents.`);
        }

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
