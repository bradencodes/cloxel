const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Week = require('../../models/Week');
const User = require('../../models/User');

// @route   POST api/weeks
// @desc    Create week
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('start', 'Start is required')
        .not()
        .isEmpty(),
      check('end', 'End is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newWeek = new Week({
        user: req.user.id,
        start: req.body.start,
        end: req.body.end,
        activities: req.body.activities,
        active: req.body.active
      });

      const week = await newWeek.save();

      res.json(week);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/weeks/:id
// @desc    Get week by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const week = await Week.findById(req.params.id);

    if (!week) {
      return res.status(404).json({ errors: [{ msg: 'Week not found' }] });
    }

    if (req.user.id !== week.user.toString()) {
      return res
        .status(403)
        .json({ errors: [{ msg: 'Week does not belong to user' }] });
    }

    res.json(week);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ errors: [{ msg: 'Week not found' }] });
    }

    res.status(500).send('Server error');
  }
});

// @route   PUT api/weeks/:id
// @desc    Update a week
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const week = await Week.findById(req.params.id);

    if (!week) {
      return res.status(404).json({ errors: [{ msg: 'Week not found' }] });
    }

    if (req.user.id !== week.user.toString()) {
      return res
        .status(403)
        .json({ errors: [{ msg: 'Week does not belong to user' }] });
    }

    const changedWeek = ({ start, end, activities, active } = req.body);

    const updatedWeek = await Week.findByIdAndUpdate(
      req.params.id,
      changedWeek,
      { new: true }
    );

    return res.json(updatedWeek);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/weeks/:id
// @desc    Delete a week
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const week = await Week.findById(req.params.id);

    if (!week) {
      return res.status(404).json({ errors: [{ msg: 'Week not found' }] });
    }

    if (req.user.id !== week.user.toString()) {
      return res
        .status(403)
        .json({ errors: [{ msg: 'Week does not belong to user' }] });
    }

    await week.remove();

    res.json({ successes: [{ msg: 'Week removed' }] });
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ errors: [{ msg: 'Week not found' }] });
    }

    res.status(500).send('Server error');
  }
});

module.exports = router;
