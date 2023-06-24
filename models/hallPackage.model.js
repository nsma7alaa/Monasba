import mongoose from 'mongoose';
const { Schema } = mongoose;

const hallPackageSchema = new Schema({
userId:{//what place
        type: String,
         required:true,
    },

placeId:{//what place
    type: String,
     required:true,
},
HallId:{ //which hall
    type: String,
     required:true,
},
packageName:{
    type: String,
     required:true,
},
Title:{
    type: String,
     required:true,
},
desc:{
    type: String,
    required: true,
},
priceNum:{
    type: Number,
    default : 0,
},
peopleNUm:{
    type: Number,
    default : 0,
},


},{
    timestamps:true
});
 
export default mongoose.model("Package", hallPackageSchema)