import createError from "../utils/createError.js"
import Reservation from "../models/reservation.model.js";
import Place from "../models/place.model.js"
import Stripe from "stripe";

export const intent = async (req,res,next)=> {
    const stripe = new Stripe(
        process.env.STRIPE
    );
    const place =await Place.findById(req.params.id)


    const paymentIntent = await stripe.paymentIntents.create({
        amount: place.price,
        currency: "eg",
        automatic_payment_methods: {
            enabled:true,
        },

    });

    const newReservation = new Reservation({
        placeId: place._id,
        img: place.cover,
        placeName: place.placeName,
        buyerId:req.userId,
        sellerId:place.userId,
        cat:place.cat,
        payment_intent: paymentIntent.id,
    });
    await newReservation.save();
res.status(200).send({
    clientSecret: paymentIntent.client_secret,
})
};
export const getReservations =async (req,res,next)=>{
try {
    const reservations = await Reservation.find({
        ...(req.isSeller ? {sellerId: req.userId} : {buyerId:req.userId}),
        isCompleted: true,
    });
    res.status(200).send(reservations);
} catch (err) {
    next(err);
}
};
export const confirm = async(req,res,next) => {
    try {
        const reservations= await Reservation.findByIdAndUpdate(
            {
                paymentIntent: req.body.paymentIntent,
            },{
            $set: {
                isCompleted:true,
            },}
        );
        res.status(200).send(" reservation is confirmed!");
    } catch (err) {
        next(err);
        
    }
}
