const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Activity = require('../../models/Activity');

// @route   POST api/activities
// @desc    Create activity
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required')
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
      const newActivity = new Activity({
        user: req.user.id,
        name: req.body.name,
        color: req.body.color,
        progress: req.body.progress,
        target: req.body.target,
        start: req.body.start,
        end: req.body.end,
        repeat: req.body.repeat,
        adds: req.body.adds,
        nextReset: req.body.nextReset,
        deleted: req.body.deleted
      });

      const activity = await newActivity.save();

      res.json(activity);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   GET api/activities
// @desc    Get all not-deleted activities of user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const activities = await Activity.find({
      user: req.user.id,
      deleted: false
    });

    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/activities/deleted
// @desc    Get all deleted activities of user
// @access  Private
router.get('/deleted', auth, async (req, res) => {
  try {
    const activities = await Activity.find({
      user: req.user.id,
      deleted: true
    });

    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/activities/:id
// @desc    Get activity by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ errors: [{ msg: 'Activity not found' }] });
    }

    if (req.user.id !== activity.user.toString()) {
      return res
        .status(403)
        .json({ errors: [{ msg: 'Activity does not belong to user' }] });
    }

    res.json(activity);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ errors: [{ msg: 'Activity not found' }] });
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
