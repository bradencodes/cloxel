const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  timeZone: {
    type: String,
    required: true,
    default: 'local'
  },
  activities: [
    {
      type: Schema.Types.ObjectId,
      ref: 'activity'
    }
  ],
  deletedActivities: [
    {
      type: Schema.Types.ObjectId,
      ref: 'activity'
    }
  ],
  active: {
    type: Schema.Types.ObjectId,
    ref: 'activity'
  },
  breaktime: {
    type: Schema.Types.ObjectId,
    ref: 'breaktime'
  }
});

module.exports = User = mongoose.model('user', UserSchema);
