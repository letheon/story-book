const express = require('express');
const router = express.Router();
const { protected, guestOnly } = require('../middleware/auth');

// @desc  Login/Landing page
// @route GET /
router.get('/', guestOnly, (req, res) => {
  res.render('login', { layout: 'login' });
});

// @desc  Login/Landing page
// @route GET /
router.get('/dashboard', protected, (req, res) => {
  res.render('dashboard');
});

module.exports = router;
