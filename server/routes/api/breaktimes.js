const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Breaktime = require('../../models/Breaktime');

// @route   GET api/breaktimes
// @desc    Get breaktime of user
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

// @route   PUT api/breatimes
// @desc    Update breaktime of user
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    const breaktime = await Breaktime.find({
      user: req.user.id
    });

    const changedBreaktime = ({ start, end } = req.body);

    const updatedBreaktime = await Breaktime.findByIdAndUpdate(
      breaktime.id,
      changedBreaktime,
      { new: true }
    );

    return res.json(updatedBreaktime);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ errors: [{ msg: 'Breaktime not found' }] });
    }

    res.status(500).send('Server error');
  }
});
