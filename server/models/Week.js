const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WeekSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  start: {
    type: Number,
    required: true
  },
  end: {
    type: Number,
    required: true
  },
  active: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

module.exports = Week = mongoose.model('week', WeekSchema);
