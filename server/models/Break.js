const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BreakSchema = new Schema({
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
    type: Array,
    required: true
  },
  end: {
    type: Array,
    required: true
  }
});

module.exports = Break = mongoose.model('break', BreakSchema);
