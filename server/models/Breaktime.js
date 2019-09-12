const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BreaktimeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  name: {
    type: String,
    required: true,
    default: 'Break Time'
  },
  color: {
    type: String,
    required: true,
    default: '#FDD835'
  },
  start: {
    type: [Number],
    required: true
  },
  end: {
    type: [Number],
    required: true
  }
});

module.exports = Breaktime = mongoose.model('breaktime', BreaktimeSchema);
