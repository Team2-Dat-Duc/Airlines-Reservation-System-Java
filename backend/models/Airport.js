const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    code: { type: String, required: true },
    name: { type: String, required: true },
    country: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Airport', airportSchema);

