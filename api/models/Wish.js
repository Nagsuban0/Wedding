const mongoose = require('mongoose');

const wishSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email:    { type: String, required: true },
  message:  { type: String, required: true },
  photo:    { type: String, default: "" }, // base64 image data
  likes:    { type: Number, default: 0 },
  createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Wish', wishSchema);
