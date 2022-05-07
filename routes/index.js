const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome page
router.get('/', (req, res) => {
    res.send('Welcome')
})

// Dashboard 
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.send('dashboard')
})

module.exports = router;