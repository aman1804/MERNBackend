const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const generateToken = require('../utils/generateToken');


const userSchema = mongoose.Schema(
    {
      
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      isAdmin: {
        type: Boolean,
        required: true,
        default: false,
      },
      isVerified: {
        type: Boolean,
        required: true,
        default: false,
      },
      emp_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee", // Reference to the User collection
      },
      passwordResetToken: String, // Add password reset token field
      passwordResetExpires: Date, // Add password reset expiration field
    },
    {
      timestamps: true,
    }
  );
  
  userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = generateToken(this._id); // Using the generateToken function
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
    return resetToken;
  };
  
  
  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  // will encrypt password everytime its saved
  userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    console.log(salt)
    this.password = await bcrypt.hash(this.password, salt);
    console.log(this.password)
  });
  
  const User = mongoose.model("User", userSchema);
  
  module.exports = User;