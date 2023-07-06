const SavedPlace = require('./models/savedPlace');

// Assuming you have the placeId and userId available
SavedPlace.create({ placeId, userId })
  .then(savedPlace => {
    // Handle success
  })
  .catch(error => {
    // Handle error
  });

  // Assuming you have the userId available
SavedPlace.find({ userId })
.populate('placeId') // Populate the associated place details
.then(savedPlaces => {
  // Handle success and display the saved places
})
.catch(error => {
  // Handle error
});

exports.deletesavedPlace = asyncHandler(async (req,res,next)=>{
  const userId = req.user.id;
  // Delete the place owned by the user from the database
   await savedPlace.deleteOne({ owner: userId }, (err, result) => {
        if (err) {
          return next(new AppError('failed to delete place', 500));
        }
        if (result.deletedCount === 0) {
          return next(new AppError('place not found', 404));
        }

        res.json({ message: 'Place deleted successfully' });
      });
    });