const mongoose = require('mongoose');

const featuredDestinationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    cabinType: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeaturedDestination', featuredDestinationSchema);

