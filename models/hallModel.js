const mongoose = require("mongoose");
const Schema  = mongoose.Schema;

const hallSchema = new Schema({

place:{//what place
    type: mongoose.Schema.Types.ObjectId, ref: 'Place'
},
Hallname:{
    type: String,
     required:true,
},
desc:{
    type: String,
     required:true,
},
address:{
    type: String,
     required:true,
},
totalstars:{
    type: Number,
    default : 0,
},
starNumber:{
    type: Number,
    default : 0,
},
details:{
    type: String,
     required:true,
},
cat:{
    type: [String],
     required:false,
},
cover:{
    type: String,
     required:true,
},
images:{
    type: [String],
     required:true,
},
starRates:{
    type:[Number],
    default : 0,
},
refundTime:{
    type: Number,
    default : 3,
},
calendar:{
    type:[String],
    required: true,
},


},{
    timestamps:true
});
 
module.exports = mongoose.model("Hall", hallSchema);