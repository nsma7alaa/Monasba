import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReservationSchema = new Schema({ 
placeId:{
    type:String,
    required:true,
 },
img:{
   type:String,
   required:false,
},
placeName:{
   type:String,
   required:false,
},
buyerId:{
   type:String,
   required:true,
},
cat:{
   type:String, 
   required:true,
},

sellerId:{
   type:String,
   required:true,
},
date:{
   type:Date,
   required:true,
},
isCompleted:{
   type:Boolean,
   default: false,
},
payment_intent:{
   type:String,
   required : true,
},
package_name:{
   type:String,
   required: true
}


},{
    timestamps:true
});


export default mongoose.model("Reservation", ReservationSchema)