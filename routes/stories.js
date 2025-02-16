const express = require('express');
const router = express.Router();
const { protected } = require('../middleware/auth');

const Story = require('../models/Story');
const { route } = require('.');
const User = require('../models/User');

// @desc  Show all stories
// @route GET /stories
router.get('/', protected, async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();

    res.render('stories/index', { stories });
  } catch (err) {
    console.error(err);
    res.render('error/500', { errorMessage: err.message });
  }
});

// @desc  Show story
// @route GET /stories/:id
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    })
      .populate('user')
      .lean();

    if (!story) {
      return res.render('error/404');
    }

    res.render('stories/show', { story });
  } catch (err) {
    console.error(err);
    res.render('error/500', { errorMessage: err.message });
  }
});

// @desc  Show all stories for user
// @route GET /stories/user/:userId
router.get('/user/:userId', protected, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).lean();

    if (!user) {
      res.render('error/404');
    }

    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();

    res.render('stories/user', { stories, user });
  } catch (err) {
    console.error(err);
    res.render('error/500', { errorMessage: err.message });
  }
});

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

router.get('/edit/:id', protected, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();

    if (!story) {
      return res.render('error/404');
    }

    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      res.render('stories/edit', { story });
    }
  } catch (err) {
    console.error(err);
    res.render('error/500', { errorMessage: err.message });
  }
});

// @desc Update story
// @route PUT /stories/:id
router.put('/:id', protected, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render('error/404');
    }

    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      story = await Story.findByIdAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect('/stories');
    }
  } catch (err) {
    console.error(err);
    res.render('error/500', { errorMessage: err.message });
  }
});

// @desc Delete story
// @route DELETE /stories/:id
router.delete('/:id', protected, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render('error/404');
    }

    if (story.user != req.user.id) {
      await Story.remove({ _id: req.params.id });
    }
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500', { errorMessage: err.message });
  }
});

module.exports = router;
