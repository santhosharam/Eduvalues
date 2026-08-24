const path = require('path');
const fs = require('fs');

const getBlogs = async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../database/blogs.json');
        
        if (!fs.existsSync(filePath)) {
            return res.json({ success: true, blogs: [] });
        }
        
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const blogs = JSON.parse(rawData);
        
        res.json({ success: true, blogs });
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).json({ success: false, message: 'Server error retrieving blogs' });
    }
};

module.exports = { getBlogs };
