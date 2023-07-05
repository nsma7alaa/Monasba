const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const placeRoute = require('./placeRoute');
const hallRoute = require('./hallRoute');

const mountRoutes = (app) => {
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/places', placeRoute);
  app.use('/api/v1/places/single/:id',hallRoute);
};

module.exports = mountRoutes;
