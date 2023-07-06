const Notification = require('./models/notification');

// Assuming you have the placeId and message available
function createNotification(placeId, message) {
  // Find all the users who have saved the place
  SavedPlace.find({ placeId })
    .then(savedPlaces => {
      // Create a notification for each saved place
      const notifications = savedPlaces.map(savedPlace => {
        return {
          userId: savedPlace.userId,
          placeId,
          message,
        };
      });

      // Create the notifications in the database
      Notification.create(notifications)
        .then(createdNotifications => {
          // Handle success
        })
        .catch(error => {
          // Handle error
        });
    })
    .catch(error => {
      // Handle error
    });
}