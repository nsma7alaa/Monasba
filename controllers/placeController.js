const  Place = require('../models/placeModel.js');
const AppError = require('../utils/appError');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const handlersFactory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');

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

exports.createPlace = asyncHandler( async (req,res)=>{
    const document = await Place.create({
        userId: req.userId,
        ...req.body,});

    res.status(200).json({
        status:'success',
        data: {
            document,
        }
    });
 
});

exports.deletePlace = asyncHandler(async (req,res,next)=>{
    const document = await Place.findByIdAndDelete(req.params.id);
    if (!document) {
        return next(new AppError(`No document for this id ${id}`, 404));
      }
  
      res.status(204).json({
        status: 'success',
        data: null,
      });

});

exports.getPlace = handlersFactory.getOne(Place);

exports.getAllPlaces = handlersFactory.getAll(Place);

exports.updatePlaceData = asyncHandler(async (req, res, next) => {
    const updatedPlace = await Place.findByIdAndUpdate(
      req.place.id,
      {
        placeName: req.body.placeName,
        desc: req.body.desc,
        address: req.body.address,
        priceRange: req.body.priceRange,
        totalstars: req.body.totalstars,
        hallsNumber: req.body.hallsNumber,
        cover: req.body.cover,
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