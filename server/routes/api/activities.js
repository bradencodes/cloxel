const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Activity = require('../../models/Activity');
const User = require('../../models/User');
const Breaktime = require('../../models/Breaktime');

// @route   POST api/activities
// @desc    Create activity
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Activity name is required')
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
        displayTarget: req.body.displayTarget,
        start: req.body.start,
        end: req.body.end,
        repeat: req.body.repeat,
        adds: req.body.adds
      });

      const activity = await newActivity.save();
      let user = await User.findById(req.user.id);
      user.activities.push(activity.id);
      await user.save();

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
    let activities = await Activity.find({
      user: req.user.id
    });

    activities = activities.filter(
      activity => activity.inserted.length > activity.removed.length
    );

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
    let activities = await Activity.find({
      user: req.user.id
    });

    activities = activities.filter(
      activity => activity.inserted.length === activity.removed.length
    );

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

// @route   PUT api/activities/update/:id
// @desc    Update an activity
// @access  Private
router.put(
  '/update/:id',
  [
    auth,
    [
      check('name', 'Activity name is required')
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
      const activity = await Activity.findById(req.params.id);

      if (!activity) {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Activity not found' }] });
      }

      if (req.user.id !== activity.user.toString()) {
        return res
          .status(403)
          .json({ errors: [{ msg: 'Activity does not belong to user' }] });
      }

      const changedActivity = ({
        name,
        color,
        displayTarget,
        start,
        end,
        repeat,
        adds,
        inserted,
        removed
      } = req.body);

      const updatedActivity = await Activity.findByIdAndUpdate(
        req.params.id,
        changedActivity,
        { new: true }
      );

      return res.json(updatedActivity);
    } catch (err) {
      console.error(err.message);

      if (err.kind === 'ObjectId') {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Activity not found' }] });
      }

      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/activities/changeDoing
// @desc    Change which activity is being done
// @access  Private
router.put('/changeDoing', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { doNowId, wasDoingId, time } = req.body;

    let user = await User.findById(userId);
    let doNow = await Activity.findById(doNowId);
    if (!doNow) {
      doNow = await Breaktime.findById(doNowId);
    }
    let wasDoing = await Activity.findById(wasDoingId);
    if (!wasDoing) {
      wasDoing = await Breaktime.findById(wasDoingId);
    }

    doNow.start.push(time);
    wasDoing.end.push(time);
    user.active = doNowId;

    await doNow.save();
    await wasDoing.save();
    await user.save();
    res
      .status(200)
      .json({ successes: [{ msg: 'Doing changed', param: 'changeDoing' }] });
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        errors: [
          { msg: 'Activity or activities not found', param: 'changeDoing' }
        ]
      });
    }

    res.status(500).send('Server error');
  }
});

// @route   PUT api/activities/remove/:id
// @desc    Add current time to activity's as removed array
// @access  Private
router.put('/remove/:id', auth, async (req, res) => {
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

    let user;

    if (activity.inserted.length > activity.removed.length) {
      user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $pull: { activities: activity._id },
          $push: { deletedActivities: activity._id }
        },
        { new: true }
      );
      activity.removed.push(req.body.now);
      await activity.save();
    }

    res.json({ successes: [{ msg: 'Activity successfully removed' }] });
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ errors: [{ msg: 'Activity not found' }] });
    }

    res.status(500).send('Server error');
  }
});

module.exports = router;
