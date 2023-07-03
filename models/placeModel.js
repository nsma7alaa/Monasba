const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema({

placeName:{
    type: String, 
     required:true, 
},
desc:{
    type: String,
     required:false,
},
address:{
    type: String,
     required:true,
},
priceRangeMax:{
    type: Number,
    default : 0,
},
priceRangeMin:{
    type: Number,
    default : 0,
},
totalstars:{
    type: Number,
    default : 0,
},
starNumber:{
    type: Number,
    default : 0,
},
hallsNumber:{
    type: Number,
    default : 1,
},
cover:{
    type: String,
     required:false,
},

refund_time:{
    type: Number,
    default: 3,
},
phoneNumber:{
    type: String,
    required: false,
},
halls:[
    {
      type:mongoose.Schema.Types.ObjectId, ref: 'Hall'
    }
],
active: {
    type: Boolean,
    default: true,
  },

},{
    timestamps:true
});

placeSchema.pre(/^find/, function (next) {
    // this points to the current query.
    this.find({ active: { $ne: false } });
    next();
  });

const Place = mongoose.model('Place', placeSchema)
module.exports = Place;