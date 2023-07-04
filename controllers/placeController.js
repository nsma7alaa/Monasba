const  Place = require('../models/placeModel.js');
const AppError = require('../utils/appError');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const handlersFactory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const User = require('../models/userModel.js');


// Upload single image
exports.uploadPlaceImage = uploadSingleImage('cover');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

    if (req.file) {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 95 })
        .toFile(`uploads/places/${filename}`);
  
      // Save image into our db
      req.body.cover = filename;
    }
    next();
  });


exports.createPlace = asyncHandler(async (req,res,next)=>{
  try {
    const userId = req.user.id;
    // Check if the user is the owner
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    // Check if the user already has a place
    const existingPlace = await Place.findOne({ owner: userId });
    if (existingPlace) {
      return next(new AppError('You can only have one place.', 400));
    }
    // Create a new place
    const newPlace = new Place({
      owner: user._id,
      ...req.body
      // Set additional fields for the place
    });
    // Save the new place
    await newPlace.save();
    res.status(200).json({
      status: 'success',
      data: {
        newPlace,
      }
  });} catch (err) {
    console.error('Failed to create place', err);
    res.status(400).json({ error: 'You can only have one place.' });
  }
});

exports.deletePlace = asyncHandler(async (req,res,next)=>{
  const userId = req.user.id;
  // Delete the place owned by the user from the database
   await Place.deleteOne({ owner: userId }, (err, result) => {
        if (err) {
          return next(new AppError('failed to delete place', 500));
        }
        if (result.deletedCount === 0) {
          return next(new AppError('place not found', 404));
        }

        res.json({ message: 'Place deleted successfully' });
      });
    });

exports.getPlace = handlersFactory.getOne(Place);

exports.getAllPlaces = handlersFactory.getAll(Place);

//getplacefromtheowner
exports.getMyPlace = asyncHandler(async (req,res, next)=>{
  const userId = req.user.id;
  const existingPlace = await Place.findOne({ owner: userId });
  if (existingPlace) {
    return res.status(200).json({
      status: 'success',
      data: {
        existingPlace,
      }});
  }
  next(new AppError('There is no place for this owner yet', 400));
});

//updateplace from his owner
exports.updateMyplace = asyncHandler(async (req,res,next)=>{
  const userId = req.user.id;
  const updatedData = req.body;

    await Place.findOne({ owner: userId }, (err,place)=>{
    if (err){ return next(new AppError('Failed to retrieve place from database',500)) }

    if (!place) {
      return res.status(404).json({ error: 'Place not found' });
     }
    })
    await Place.updateOne({ owner: userId }, { $set: updatedData }, (err) => {
    if (err) {
      return next(new AppError('Failed to update place',500));
    }}) 

    res.status(200).json({
    status: 'success'
  });
});