const express = require('express');
const multer = require('multer');
const {uploadImage} = require('../controllers/imageController');

const router = express.Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'images/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });

// const upload = multer({ storage: storage });
// router.route('/upload').post( upload.single('image'), uploadImage)


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

// app.use(cors())

router.post('/image', upload.single('file'),uploadImage)
module.exports = router;
