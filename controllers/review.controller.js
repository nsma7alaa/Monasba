import createError from "../utils/createError.js"
import Review from "../models/review.model.js";
import Place from "../models/place.model.js";

export const createReview = async (req,res,next)=>{
        if(req.isPlaceOwner) return next(createError(403,"sellers can't create a review "));
        
        const newReview = new Review({
            userId: req.userId,
            placeId: req.body.placeId,
            desc: req.body.desc,
            star: req.body.star,
        });
    try{
        const review = await Review.findOne({
            placeId:req.body.placeId,
            userId: req.userId,
        });
        if(review) return next(createError(403,"you have already created a review for this place"));
        const savedReview = await newReview.save();

        await Place.findByIdAndUpdate(req.body.placeId, {$inc:  {totalstars : req.body.star, starNumber: 1},
        });
        res.status(201).send(savedReview); 
    }
    catch (err) {next(err); }

};
export const getReviews = async (req,res,next)=>{

    try {
        const reviews = await Review.find({placeId: req.params.placeId});
        res.status(200).send(reviews);
    } catch (err) {next(err); }

};
export const deleteReview = async (req,res,next)=>{

    try {
        
    } catch (err) {next(err); }

};