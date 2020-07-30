const express = require('express');
const router = express.Router();
const { protected } = require('../middleware/auth');

const Story = require('../models/Story');

// @desc  Show New Story page
// @route GET /stories/add
router.get('/add', protected, (req, res) => {
  res.render('stories/add');
});

// @desc  Process New Story
// @route POST /stories
router.post('/', protected, async (req, res) => {
  try {
    req.body.user = req.user.id;

    await Story.create(req.body);

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500', { errorMessage: err.message });
  }
});

module.exports = router;
