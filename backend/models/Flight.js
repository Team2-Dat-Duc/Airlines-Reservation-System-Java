const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dep: { type: String, required: true },
    arr: { type: String, required: true },
    depTime: { type: String, required: true },
    arrTime: { type: String, required: true },
    duration: { type: String, required: true },
    stops: { type: String, required: true },
    price: { type: Number, required: true }, 
    isCheapest: { type: Boolean, default: false },
    img: { type: String },
    aircraft: { type: String, default: "Airbus A321" },
    terminalDep: { type: String, default: "T1" },
    terminalArr: { type: String, default: "T2" },
    depDate: { type: String, required: true },
    arrDate: { type: String, required: true },
    baggageRules: [{
        id: Number,
        text: String
    }],
    seats: {
      business: {
        total: Number,
        booked: Number,
        priceAddOn: Number,
        baggage: { type: String, default: "40kg Checked + 14kg Cabin" } 
      },
      economyStandard: {
        total: Number,
        booked: Number,
        priceAddOn: Number,
        baggage: { type: String, default: "20kg Checked + 7kg Cabin" }
      },
      economyLite: {
        total: Number,
        booked: Number,
        priceAddOn: Number,
        baggage: { type: String, default: "10kg Checked + 7kg Cabin Only" }
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flight', flightSchema);