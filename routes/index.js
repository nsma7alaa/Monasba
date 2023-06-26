const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const placeRoute = require('./placeRoute');


const mountRoutes = (app) => {
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/places', placeRoute);
  
};

module.exports = mountRoutes;
