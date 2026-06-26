const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

const uploadProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'portfolio/profile',
      transformation: [{ width: 600, height: 600, crop: 'fill' }],
    });

    fs.unlinkSync(req.file.path);

    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
};

const uploadProject = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'portfolio/projects',
      transformation: [{ width: 800, crop: 'scale' }],
    });

    fs.unlinkSync(req.file.path);

    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
};

const uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'portfolio/cv',
      resource_type: 'raw',
    });

    fs.unlinkSync(req.file.path);

    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
};

module.exports = { uploadProfile, uploadProject, uploadCV };
