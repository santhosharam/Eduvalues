const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI;
        let isMemoryDB = false;

        // Support for running without a local MongoDB installation
        if (uri === 'memory') {
            isMemoryDB = true;
            console.log('⏳ Starting embedded MongoDB Server...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
        }

        const conn = await mongoose.connect(uri)
        console.log(`✅ MongoDB connected: ${conn.connection.host}`)

        // Auto-seed the memory database so you can log in immediately
        if (isMemoryDB) {
            console.log('🌱 Creating default admin account...');
            const User = require('../models/User');
            if (await User.countDocuments() === 0) {
                await User.create({
                    name: 'Site Administrator',
                    email: 'admin@learnhub.com',
                    password: 'password123',
                    role: 'admin'
                });
                console.log('✅ Admin account seeded (admin@learnhub.com / password123)');
            }
        }
    } catch (err) {
        console.error(`❌ MongoDB connection error: ${err.message}`)
        process.exit(1)
    }
}

module.exports = connectDB
