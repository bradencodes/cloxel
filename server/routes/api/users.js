const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Activity = require('../../models/Activity');
const Breaktime = require('../../models/Breaktime');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Email is required')
      .not()
      .isEmpty(),
    check('email', 'Email is invalid').isEmail(),
    check('password', 'Password is required')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, initBreaktimeStart } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({
          errors: [
            { msg: 'Email already belongs to an account', param: 'email' }
          ]
        });
      }

      user = new User({
        name,
        email,
        password,
        activities: [],
        deletedActivities: [],
        active: null,
        breaktime: null
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      let breaktime = new Breaktime({
        user: user.id,
        start: [initBreaktimeStart],
        end: []
      });

      const work = new Activity({
        user: user.id,
        name: 'Work',
        color: '#607D8B',
        displayTarget: 28800000,
        start: [],
        end: [],
        repeat: [0, 1, 1, 1, 1, 1, 0],
        adds: false
      });

      const sleep = new Activity({
        user: user.id,
        name: 'Sleep',
        color: '#80DEEA',
        displayTarget: 28800000,
        start: [],
        end: [],
        repeat: [1],
        adds: false
      });

      user.activities.push(work);
      user.activities.push(sleep);
      user.breaktime = breaktime;
      user.active = breaktime;

      await breaktime.save();
      await work.save();
      await sleep.save();

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/users
// @desc    Update user
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    const changedUser = ({
      name,
      email,
      password,
      timeZone,
      activities,
      deletedActivities,
      active
    } = req.body);

    const updatedUser = await User.findByIdAndUpdate(req.user.id, changedUser, {
      new: true
    }).select('-password');

    return res.json(updatedUser);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ errors: [{ msg: 'Activity not found' }] });
    }

    res.status(500).send('Server error');
  }
});

module.exports = router;
