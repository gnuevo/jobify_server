var {mongoose} = require('./../db/mongoose');

var Job = mongoose.model('Job', {
  id: {
    type: String,
    required: true,
    unique: true
  },
  platform: {
    type: String,
    required: true
  },
  jobUrl: {
    type: String,
    required: true
  },
  history: [{ status: String, title: String, text: String, date: Date}],
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  place: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = {Job};
