const  Place = require('../models/placeModel.js');
const AppError = require('../utils/appError');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const handlersFactory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const { TriggerContextImpl } = require('twilio/lib/rest/api/v2010/account/usage/trigger.js');
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

exports.deletePlace = handlersFactory.deleteOne(Place);

// exports.deletePlace = asyncHandler(async (req,res,next)=>{
//     const document = await Place.findByIdAndDelete(req.params.id);
//     if (!document) {
//         return next(new AppError(`No document for this id ${id}`, 404));
//       }
  
//       res.status(204).json({
//         status: 'success',
//         data: null,
//       });

// });

exports.getPlace = handlersFactory.getOne(Place);

exports.getAllPlaces = handlersFactory.getAll(Place);

// exports.updatePlaceData = asyncHandler(async (req, res, next) => {
//     const updatePlace = await Place.findByIdAndUpdate(
//       req.params.id,
//       {
//         placeName: req.body.placeName,
//         desc: req.body.desc,
//         address: req.body.address,
//         priceRange: req.body.priceRange,
//         totalstars: req.body.totalstars,
//         hallsNumber: req.body.hallsNumber,
//         cover: req.body.cover,
//         refund_time: req.body.refund_time,
//         halls: req.body.halls,
//       },
//       { new: true ,
//       renValidators: true,}
//     );
//     if (!updatePlace) {
//       return next(new AppError(`No place for this id ${req.params.id}`, 404));
//     }
//     await updatePlace.save();
  
//     res.status(200).json({
//       status: 'success',
//       data: {updatePlace,
//     },
//   });
// });
//getplacefromtheowner
exports.getMyPlace = asyncHandler(async (req,res, next)=>{
  req.params.id = req.user._id,
  next();
});

//updateplace from his owner
exports.updateMyplace = asyncHandler(async (req,res,next)=>{
  const updatedPlace = await Place.findByIdAndUpdate(
    req.Place.id,{
      placeName: req.body.placeName,
        desc: req.body.desc,
        address: req.body.address,
        priceRangeMax: req.body.priceRangeMax,
        priceRangeMin: req.body.priceRangeMin,
        totalstars: req.body.totalstars,
        hallsNumber: req.body.hallsNumber,
        cover: req.body.cover,
        phoneNumber: req.body.phoneNumber,
        refund_time: req.body.refund_time,
        halls: req.body.halls,
    },
    { new: true }
  );

  await updatedPlace.save();

  res.status(200).json({
    status: 'success',
    data: updatedPlace,
  });
});
//deleteMyplace
exports.deleteSavedPlaceData = asyncHandler(async (req, res, next) => {
  await Place.findByIdAndUpdate(req.Place._id, { active: false });

  res.status(204).json({
    status: 'Success',
  });
});
