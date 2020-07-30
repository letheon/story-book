const express = require('express');
const router = express.Router();
const { protected, guestOnly } = require('../middleware/auth');

const Story = require('../models/Story');

// @desc  Login/Landing page
// @route GET /
router.get('/', guestOnly, (req, res) => {
  res.render('login', { layout: 'login' });
});

// @desc  Login/Landing page
// @route GET /
router.get('/dashboard', protected, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();

    res.render('dashboard', { 
      name: req.user.firstName,
      stories: stories
    });
  } catch (err) {
    console.error(err);
    res.render('error/500', { errorMessage: err.message });
  }
});

module.exports = router;
