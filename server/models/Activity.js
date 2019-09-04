const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    required: true
  },
  target: {
    type: Number,
    required: true
  },
  start: {
    type: Map,
    of: [[Number]],
    required: true
  },
  end: {
    type: Map,
    of: [[Number]],
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
  nextReset: {
    type: Number,
    required: true
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = Activity = mongoose.model('activity', ActivitySchema);
