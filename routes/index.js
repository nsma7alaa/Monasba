const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const placeRoute = require('./placeRoute');
const hallRoute = require('./hallRoute');
const SavedPlace = require('./savedPlaceRoutes');
const HallPackage = require('../models/hallPackage.model');


const mountRoutes = (app) => {
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/places', placeRoute);
  app.use('/api/v1/places/single/:id',hallRoute);
  app.use('/api/v1/savedPlace', SavedPlace);
  app.use('/api/v1/Packages', HallPackage);
  
};

module.exports = mountRoutes;
