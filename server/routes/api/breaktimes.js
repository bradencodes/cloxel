const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Breaktime = require('../../models/Breaktime');

// @route   GET api/breaktimes
// @desc    Get break of user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const breaktime = await Breaktime.find({
      user: req.user.id
    });

    res.json(breaktime);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});
