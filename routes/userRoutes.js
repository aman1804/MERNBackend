const express = require('express');
const {registerUser,getUsers,getUser,verifyUser, updateUserProfile} = require('../controllers/userController');
const {authUser,resetPassword, forgotPassword} = require('../controllers/loginUser');
const {protect} = require('../middleware/authMiddleware');
const { saveAddress, getAddress } = require('../controllers/addressController');

const router = express.Router();


router.route('/register').post(registerUser)
router.route('/update').post(updateUserProfile)
router.route('/get').get(getUsers)
router.route(`/get/:email`).get(getUser)
router.route(`/verify/:id`).get(verifyUser)
router.route(`/login`).post(authUser)
router.route('/reset-password/:token').post(resetPassword)
router.route('/forgot-password').post(forgotPassword)
router.route('/addAddress').post(saveAddress)
router.route(`/address/:employeeId`).get(getAddress)


module.exports = router;