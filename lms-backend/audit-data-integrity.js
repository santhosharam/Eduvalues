const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoURI = process.env.MONGO_URI === 'memory' ? 'mongodb://localhost:27017/lms' : process.env.MONGO_URI;

const audit = async () => {
    try {
        console.log('--- LMS DATA INTEGRITY AUDIT START ---');
        
        await mongoose.connect(mongoURI);
        const db = mongoose.connection.db;
        
        const collections = ['lessons', 'enrollments', 'progresses', 'reviews', 'certificates', 'payments'];
        const legacyFields = ['course', 'course_id'];
        
        let totalIssues = 0;
        const report = {};

        for (const colName of collections) {
            console.log(`Auditing collection: ${colName}...`);
            const collection = db.collection(colName);
            const docs = await collection.find({}).toArray();
            
            report[colName] = {
                totalCount: docs.length,
                missingCourseId: 0,
                hasLegacyFields: 0,
                orphanedRefs: 0
            };

            for (const doc of docs) {
                // 1. Check for missing courseId
                if (!doc.courseId) {
                    report[colName].missingCourseId++;
                    totalIssues++;
                }

                // 2. Check for legacy fields
                for (const field of legacyFields) {
                    if (doc[field] !== undefined) {
                        report[colName].hasLegacyFields++;
                        totalIssues++;
                        break;
                    }
                }

                // 3. Check for orphaned references (if courseId exists)
                if (doc.courseId) {
                    const courseExists = await db.collection('courses').findOne({ _id: doc.courseId });
                    if (!courseExists) {
                        report[colName].orphanedRefs++;
                        totalIssues++;
                    }
                }
            }
        }

        console.log('\n--- AUDIT SUMMARY ---');
        console.table(report);
        
        if (totalIssues === 0) {
            console.log('\n✅ VALIDATION STATUS: PASS');
            console.log('Risk Level: LOW');
        } else {
            console.log(`\n❌ VALIDATION STATUS: FAIL (${totalIssues} issues found)`);
            console.log('Risk Level: HIGH/MEDIUM (depending on data volume)');
        }

        await mongoose.disconnect();
        process.exit(totalIssues === 0 ? 0 : 1);
    } catch (err) {
        console.error('Audit failed:', err);
        process.exit(1);
    }
};

audit();
