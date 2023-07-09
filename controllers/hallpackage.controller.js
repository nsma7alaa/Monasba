const  Package = require('../models/hallPackage.model');
const AppError = require('../utils/appError');
const asyncHandler = require('express-async-handler');
const handlersFactory = require('./handlersFactory');
const owner = require('../models/userModel');

const Hall = require('../models/hallModel.js');


exports.createPackage = asyncHandler(async (req,res,next)=>{
  try {
    const hallId = req.hall.id;
  
    const ownerId = req.user.id;

    const newPackage = new Package({

      halls: hallId,
      owner: ownerId,
      ...req.body
    
    });
    // Save the new package
    await newPackage.save();
    res.status(200).json({
      status: 'success',
      data: {
        newPackage,
      }
  });} catch (err) {
    console.error('Failed to create package', err);
    res.status(400).json({ error: 'You can only have one package.' });
  }
});

exports.deletePackage = asyncHandler(async (req,res,next)=>{
  const hallId = req.hall.id;
  // Delete the place owned by the hall from the database
   await Package.deleteOne({ owner: hallId }, (err, result) => {
        if (err) {
          return next(new AppError('failed to delete package', 500));
        }
        if (result.deletedCount === 0) {
          return next(new AppError('package not found', 404));
        }

        res.json({ message: 'Done deleted the package successfully' });
      });
    });

exports.getPackage = handlersFactory.getOne(Package);

exports.getAllPackages = handlersFactory.getAll(Package);

//getplacefromtheowner
exports.getMyPackage = asyncHandler(async (req,res, next)=>{
  const hallId = req.hall.id;
  const existingPackage = await Package.findOne({ owner: hallId });
  if (existingPackage) {
    return res.status(200).json({
      status: 'success',
      data: {
        existingPackage,
      }});
  }
  next(new AppError('There is no package for this owner yet', 400));
});

//updatepackage from his owner
exports.updateMyPackag = asyncHandler(async (req,res,next)=>{
  const hallId = req.hall.id;
  const updatedData = req.body;

    await Package.findOne({ owner: hallId }, (err,package)=>{
    if (err){ return next(new AppError('Failed to retrieve package from database',500)) }

    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
     }
    })
    await Package.updateOne({ owner: hallId }, { $set: updatedData }, (err) => {
    if (err) {
      return next(new AppError('Failed to update package',500));
    }}) 

    res.status(200).json({
    status: 'success'
  });
});