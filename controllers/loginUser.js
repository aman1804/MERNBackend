const asyncHandler = require("express-async-handler");
const User = require("../model/userModel.js");
const Employee = require("../model/employeeModel.js")
const jwt = require('jsonwebtoken');
// const crypto= require("crypto");
const { sendResetEmail } = require("../mailer/mailer.js");

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (user && (await user.matchPassword(password))) {

        if(user.isVerified){
          const emp_id = user.emp_id
          console.log(emp_id)
          const employee = await Employee.findOne({emp_id});
          if (employee) {
            res.status(201).json({
              user_id: user._id,
              emp_id: employee._id,
              first_name: employee.first_name,
              last_name: employee.last_name,
              designation:employee.designation,
              gender:employee.gender,
              dob:employee.dob,
              blood_group:employee.blood_group,
              marital_status:employee.marital_status,
              email: user.email,
              isAdmin: user.isAdmin,
              isVerified: user.isVerified,
            });
          } else {
            res.status(401);
            throw new Error("Employee not found");
          }
      }
      else{
        res.status(401);
        throw new Error("Your Account is Not verified");
      }

      } else {
        res.status(401);
        throw new Error("Invalid Email or Password");
      }
    
  });


  const resetPassword = asyncHandler (async (req, res) => {
    try {
      const token = req.params.token;
    const { password } = req.body;

    // Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(400).json({ message: 'Invalid token.' });
    }
console.log(decodedToken)
    // Find the user by ID from the decoded token
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }


  
      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred.' });
    }
  });
  
  const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      const resetToken =await user.generatePasswordResetToken();
      await user.save();
  
      await sendResetEmail(user, resetToken);
  
      res.status(200).json({ message: 'Password reset email sent.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred.' });
    }
  });
  module.exports = {authUser,resetPassword,forgotPassword};
  