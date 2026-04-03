const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
    type: { type: String, enum: ['Adult', 'Child', 'Infant'], default: 'Adult' },
    title: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    nationality: { type: String, default: 'Vietnam' }
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    phone: { type: String, default: '' },
    dateOfBirth: { type: String, default: '' },
    gender: { type: String, default: 'Other' },
    address: { type: String, default: '' },
    
    savedPassengers: [passengerSchema]
    
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);