const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hallPackageSchema = new Schema({
 packagename:{
        type: String, 
         required:true, 
    },
[title]:{
    type: String, 
     required:true, 
     
    desc:{
        type: String,
     required: false,
    }
}, 




owner: { type: mongoose.Schema.Types.ObjectId, ref: 'placeid' },

halls:[
    {
      type:mongoose.Schema.Types.ObjectId, ref: 'Hall'
    }
],

},{
    timestamps:true
});

// placeSchema.pre(/^find/, function (next) {
//     // this points to the current query.
//     this.find({ active: { $ne: false } });
//     next();
//   });

const HallPackage = mongoose.model('HallPackage', hallPackageSchema)
module.exports = HallPackage;