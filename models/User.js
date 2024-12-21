const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  verified: {
    type: Boolean,
  }
});

const User = mongoose.model('user', userSchema);

module.exports = User;
