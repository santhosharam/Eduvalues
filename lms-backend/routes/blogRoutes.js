const express = require('express');
const router = express.Router();
const { getBlogs } = require('../controllers/blogController');

// Public route to fetch blogs
router.get('/', getBlogs);

module.exports = router;
