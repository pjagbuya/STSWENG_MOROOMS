const mongoose = require("mongoose")


const reservationSchema = new mongoose.Schema({
  reservationID: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  userID: {
    type: Number,
    required: true,
    ref: 'User',
  },
  reservationSeats: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat',
  }],
  reservationStatus: {
    type: String,
    enum: ['Ongoing', 'Upcoming'],
    default: 'Upcoming',
  },
});



module.exports = mongoose.model('reservation', reservationSchema);
