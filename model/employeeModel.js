const mongoose = require("mongoose");
const {addressSchema} = require("./addressModel");

const EmployeeSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      trim: true,
      set: (value) =>
        value
          .replace(/\s+/g, " ")
          .trim()
          .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize first letter
          .replace(
            /\w+/g,
            (word) => word.charAt(0) + word.slice(1).toLowerCase()
          ), // Convert the rest to lowercase
      required: true,
    },
    last_name: {
      type: String,
      trim: true,
      set: (value) =>
        value
          .replace(/\s+/g, " ")
          .trim()
          .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize first letter
          .replace(
            /\w+/g,
            (word) => word.charAt(0) + word.slice(1).toLowerCase()
          ), // Convert the rest to lowercase
      required: true,
    },

    designation: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"], // Provide valid options
      required: true,
    },
    blood_group: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    marital_status: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      required: true,
    },
    
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
