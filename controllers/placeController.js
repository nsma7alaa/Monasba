const  Place = require('../models/placeModel.js');
const AppError = require('../utils/appError');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const handlersFactory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const createToken = require('../utils/createToken');

// Upload single image
exports.uploadUserImage = uploadSingleImage('cover');

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

export const createPlace =  async (req,res,next)=>{
    if(!req.isPlaceOwner) 
    return next(createError(403,"only placeowner can create place!"));

    const newPlace = new Place({
        userId: req.userId,
        ...req.body,
    }); 
    try{
        const savedPlace = await newPlace.save();
        res.status(201).json(savedPlace)
    } catch (err){
        next(err);
    }
 
};
export const deletePlace=  async (req,res,next)=>{
    try {
        const place = await Place.findById(req.params.id);
        if(place.userId !== req.userId) 
            return next(createError(403,"you can delete only your place"));

            await Place.findByIdAndDelete(req.params.id);
            res.status(200).send("Place has been deleted!");
    }catch(err){
        next(err)
    }

};

export const getPlace=  async (req,res,next)=>{
    try {
        const place = await Place.findById(req.params.id);
        if(!place) next(createError(404,"Place not found!"));
        res.status(200).send(place)
    }catch(err){
        next(err)
    }
};
export const getPlaces=  async (req,res,next)=>{
    const q = req.query;
    const filters = {
        ...(q.userId && {userId: q.userId}),
        ...(q.cat && {cat: q.cat}),
        ...((q.min || q.max) && {priceRange:{ ...(q.min && { $gt: q.min }), ...(q.max && {$lt: q.max})},}),
        ...(q.search && {title: { $regex: q.search, $options: "i"}}),
    }

    try {
       // const places = await Place.find(filters).sort({[q.sort]: -1 }); //to get the latest ones
        const places = await Place.find(filters)
        res.status(200).send(places)
    }catch(err){
        next(err)
    }
};