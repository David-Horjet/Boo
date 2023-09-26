const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  }],
});

module.exports = mongoose.model('Comment', commentSchema);
