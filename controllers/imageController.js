const Image = require('../model/imageModel');

const uploadImage = async (req, res) => {
  try {
    const image = new Image({
      filename: req.file.filename,
      path: req.file.path
    });

    await image.save();

    res.json({ message: 'Image uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while uploading the image' });
  }
};

module.exports = {
  uploadImage
};
