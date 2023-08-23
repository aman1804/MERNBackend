const mongoose = require('mongoose');

// Create a schema for addresses
const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true
  },
  locality: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  emp_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee", // Reference to the User collection
  },
});

const Address = mongoose.model("Address", addressSchema);
  
module.exports = Address;
