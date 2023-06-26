// const { check } = require('express-validator');
// const validatorMiddleware = require('../../middlewares/validatorMiddleware');

// exports.createPlaceValidator = [
//     check('placeName')
//       .notEmpty()
//       .withMessage('placeName required')
//       .isLength({ min: 3 })
//       .withMessage('Too short placeName'),

//     check('priceRange')
//       .notEmpty()
//       .withMessage('priceRange required'),
  
//     check('address').notEmpty().withMessage('address required'),

//     check('hallsNumber').notEmpty().withMessage('hallsNumber required'),

//     check('refund_time').notEmpty().withMessage('refund_time required').isLength({ min: 3 }).withMessage('minimum refund time is 3 days'),
  
  
//     validatorMiddleware,
//   ];
//   exports.getPlaceValidator = [
//     check('id').isMongoId().withMessage('Invalid place id format'),
//     validatorMiddleware,
//   ];

//   exports.deletePlaceValidator = [
//     check('id').isMongoId().withMessage('Invalid place id format'),
//     validatorMiddleware,
//   ];

//   exports.updateUserValidator = [
//     check('id').isMongoId().withMessage('Invalid place id format'),
  
//     check('placeName')
//       .optional()
//       .notEmpty()
//       .withMessage('firstName required')
//       .isLength({ min: 3 })
//       .withMessage('Too short placeName'),
  
//     check('address').optional.notEmpty().withMessage('address required'),

//     check('hallsNumber').optional.notEmpty().withMessage('hallsNumber required'),

//     check('refund_time').optional.notEmpty().withMessage('refund_time required').isLength({ min: 3 }).withMessage('minimum refund time is 3 days'),
  
//     check('desc').optional(),
  
//     check('cover').optional(),

//     validatorMiddleware,
//   ];
  