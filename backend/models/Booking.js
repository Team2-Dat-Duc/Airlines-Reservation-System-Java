const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
    flightDetails: {
      name: String, dep: String, arr: String, depTime: String,
      arrTime: String, depDate: String, aircraft: String, img: String
    },
    
    returnFlight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
    returnFlightDetails: {
      name: String, dep: String, arr: String, depTime: String,
      arrTime: String, depDate: String, aircraft: String, img: String
    },

    pnr: { type: String, required: true, unique: true }, 
    seatType: { 
      type: String, 
      enum: ['business', 'economyStandard', 'economyLite'], 
      required: true 
    },
    
    contact: { firstName: String, lastName: String, email: String, phone: String },
    
    passengers: [{
      type: { type: String, enum: ['Adult', 'Child', 'Infant'] }, 
      title: String, firstName: String, lastName: String, dateOfBirth: String, nationality: String,
      baggageOption: { type: String, default: 'No Checked Baggage' }, 
      seatPreference: { type: String, enum: ['Any', 'Window', 'Aisle'], default: 'Any' }
    }],
    totalPrice: { type: Number, required: true },
    
    status: { 
      type: String, 
      default: 'Pending', 
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'] 
    },
    expiresAt: { type: Date },
    reminderSent: { type: Boolean, default: false } 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);