const asyncHandler = require("express-async-handler");
const User = require("../model/userModel.js");
const Employee = require("../model/employeeModel.js");
const { sendConfirmationEmail } = require("../mailer/mailer.js");
const generateToken = require("../utils/generateToken");

const mongoose = require("mongoose");

const registerUser = asyncHandler(async (req, res) => {
  const {
    first_name,
    last_name,
    blood_group,
    gender,
    designation,
    dob,
    marital_status,
    email,
    password,
  } = req.body;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userExits = await User.findOne({ email });

    if (userExits) {
      throw new Error("User Already exists");
    }

    const employee = await Employee.create(
      [
        {
          first_name,
          last_name,
          designation,
          gender,
          blood_group,
          dob,
          marital_status,
        },
      ],
      { session }
    );
    

    if (employee) {
      const user = await User.create(
        [
          {
            email,
            password,
            emp_id:employee[0]._id
          },
        ],
        { session }
      );

      if (user) {
        console.log(user[0]);

        // Sending confirmation email
        const confirmEmail = await sendConfirmationEmail(user[0]); // Provide the recipient email here
        console.log(confirmEmail);
        if (confirmEmail) {
          await session.commitTransaction();
          const token = generateToken(user[0]._id);

          res.status(201).json({
            message: "Registration successful",
            user_id: user[0]._id,
            emp_id: employee[0]._id,
            first_name: employee[0].first_name,
            last_name: employee[0].last_name,
            email: user[0].email,
            token: token,
          });
        } else {
          console.log("email not sent");
          res.status(400);
          throw new Error("Error occurred while sending email");
        }

        // Rest of the response and email sending logic
      } else {
        await session.abortTransaction();
        res.status(400);
        throw new Error("Error occurred while creating employee");
      }
    } else {
      await session.abortTransaction();
      res.status(400);
      throw new Error("Error occurred while creating user");
    }
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, { password: 0 });

  if (users) {
    res.status(201).json(users); // Assuming users is an array of user objects
  } else {
    res.status(400);
    throw new Error("Error occurred");
  }
});

const getUser = asyncHandler(async (req, res) => {
  const userEmail = req.params.email;

  const user = await User.findOne({ email: userEmail });

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  const employee = await Employee.findOne({ user_id: user._id }).populate(
    "user_id"
  );

  if (employee) {
    const token = await user.generatePasswordResetToken();
    console.log(token);
    res.status(200).json({
      _id: employee._id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      designation: employee.designation,
      blood_group: employee.blood_group,
      gender: employee.gender,
      marital_status: employee.marital_status,
      // ... other employee fields
      user: employee.user_id, // Populated user details
    });
  } else {
    res.status(404);
    throw new Error("Employee not found for the given user");
  }
});

const verifyUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (user) {
    const isVerified = user.isVerified;
    console.log("savenotdone");

    if (!isVerified) {
      user.isVerified = true; // Update the isVerified field
      const verifiedUser = await user.save(); // Save the updated user
      console.log("User verified and updated:", verifiedUser);
    }

    res.redirect(process.env.FRONTEND_URL);
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    dob,
    bloodGroup,
    maritalStatus,
    user_id,
    emp_id,
  } = req.body;

  const employee = await Employee.findOne({ _id: emp_id }); // Use the correct field name
  const user = await User.findOne({ _id: user_id });

  if (employee && user) {
    employee.first_name = firstName || employee.first_name;
    employee.last_name = lastName || employee.last_name;
    employee.gender = gender || employee.gender;
    employee.dob = dob || employee.dob;
    employee.blood_group = bloodGroup || employee.blood_group;
    employee.marital_status = maritalStatus || employee.marital_status;

    const updatedEmployee = await employee.save();

    if (updatedEmployee) {
      res.json({
        user_id: user._id,
        emp_id: updatedEmployee._id,
        first_name: updatedEmployee.first_name,
        last_name: updatedEmployee.last_name,
        designation: updatedEmployee.designation,
        gender: updatedEmployee.gender,
        dob: updatedEmployee.dob,
        blood_group: updatedEmployee.blood_group,
        marital_status: updatedEmployee.marital_status,
        email: user.email,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      });
    }
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

module.exports = {
  registerUser,
  getUsers,
  getUser,
  verifyUser,
  updateUserProfile,
};
