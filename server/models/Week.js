const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WeekSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  start: {
    type: Number,
    required: true
  },
  end: {
    type: Number,
    required: true
  },
  activities: [{ type: Schema.Types.ObjectId, ref: 'activity' }],
  active: {
    type: Schema.Types.ObjectId,
    ref: 'activity'
  }
});

module.exports = Week = mongoose.model('week', WeekSchema);
