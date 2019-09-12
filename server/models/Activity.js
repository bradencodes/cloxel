const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  displayTarget: {
    type: Number,
    required: true
  },
  start: {
    type: [Number],
    required: true
  },
  end: {
    type: [Number],
    required: true
  },
  repeat: {
    type: [Boolean],
    required: true
  },
  adds: {
    type: Boolean,
    required: true
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = Activity = mongoose.model('activity', ActivitySchema);
