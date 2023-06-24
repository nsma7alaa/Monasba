const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const placeSchema = new Schema({
userId:{//to which user
    type: String,
     required:true,
},
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
priceRange:{
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
    default : 0,
},
cover:{
    type: String,
     required:false,
},

refund_time:{
    type: Number,
    default: 3,
},
halls:[
    {
      type:mongoose.Schema.Types.ObjectId, ref: 'Hall'
    }
]

},{
    timestamps:true
});

const Place = mongoose.model('Place', placeSchema)
module.exports = Place;