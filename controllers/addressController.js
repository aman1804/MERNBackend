const asyncHandler = require("express-async-handler");
const User = require("../model/userModel.js");
const Employee = require("../model/employeeModel.js");
const Address = require("../model/addressModel.js");

const saveAddress = asyncHandler(async (req, res) => {
  const { emp_id, street, locality, pincode, country, state, city } = req.body;
console.log("emp_id",emp_id)
  const address = await Address.findOne({ emp_id: emp_id });

  if (!address) {
    // If there's no existing address, create a new one
    const newAddress = await Address.create(req.body);
    if (newAddress) {
      res.status(200).json({
        street: newAddress.street,
      });
      console.log("New address saved successfully");
    } else {
      res.status(404);
      throw new Error("Error while creating a new address");
    }
  } else {
    // If an address exists, update the fields
    address.street = street || address.street;
    address.locality = locality || address.locality;
    address.pincode = pincode || address.pincode;
    address.country = country || address.country;
    address.state = state || address.state;
    address.city = city || address.city;

    const updatedAddress = await address.save();

    if (updatedAddress) {
      res.status(200).json({
        street: updatedAddress.street,
      });
      console.log("Address updated successfully");
    } else {
      res.status(404);
      throw new Error("Error while updating the address");
    }
  }
});


const getAddress = asyncHandler(async(req,res)=>{
    try {
        const employeeId = req.params.employeeId;
        const address = await Address.findOne({ emp_id: employeeId }, { emp_id: 0 });
        if (!address) {
          return res.status(404).json({ error: 'Address not found' });
        }
        res.json(address);
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
})
module.exports = { saveAddress,getAddress };
