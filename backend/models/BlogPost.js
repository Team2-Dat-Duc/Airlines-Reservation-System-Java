const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    quoteTitle: { type: String },
    quoteAuthor: { type: String },
    author: { type: String, default: 'admin' },
    content: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BlogPost', blogPostSchema);

