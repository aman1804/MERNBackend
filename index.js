const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const imageRoutes = require("./routes/imageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer")

const app = express();
app.use(express.json());



dotenv.config();
connectDB();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    },
  })
  
  const upload = multer({ storage: storage })
  
  app.use(cors())
  
  app.post('/image', upload.single('file'), function (req, res) {
    res.json({})
  })


app.get("/getdata", (req, resp) => {
  resp.send("narayan app is working fine");
});

app.use("/user", userRoutes);

app.use("/uploads", imageRoutes);

app.get("/api/getPostalData/:pincode", async (req, res) => {
  const pincode = req.params.pincode;
  const apiUrl = `http://postalpincode.in/api/pincode/${pincode}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "An error occurred" });
  }
});
// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`app server is running on ${PORT}`));
