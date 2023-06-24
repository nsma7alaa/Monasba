import Place from "../models/place.model.js";
import Hall from "../models/hall.model.js"
import createError from "../utils/createError.js"

export const createHall = async (req,res,next)=>{
    if(req.isPlaceOwner) return next(createError(403,"placeOwner can't create a Hall "));
    
    const newHall = new Hall({
        userId: req.userId,
        placeId: req.body.placeId,
        desc: req.body.desc,
        star: req.body.star,
    });
try{
    const hall = await Hall.findOne({
        placeId:req.body.placeId,
        userId: req.userId,
    });
    if(hall) return next(createError(403,"you have already created this hall"));
    const savedHall = await newHall.save();

    await Place.findByIdAndUpdate(req.body.placeId, {$inc:  {hallsNumber : req.body.hallsNumber},
    });
    res.status(201).send(savedHall);
}
catch (err) {next(err); }
 
};
export const deleteHall=  async (req,res,next)=>{
    try {
        const hall = await Hall.findById(req.params.id);
        if(hall.userId !== req.userId) 
            return next(createError(403,"you can delete only your place"));

            await hall.findByIdAndDelete(req.params.id);
            res.status(200).send("Place has been deleted!");
    }catch(err){
        next(err)
    }

};

export const getHall=  async (req,res,next)=>{
    try {
    const hall = await Hall.findById({placeId:req.params.placeId}, req.params.id);
        if(!hall) next(createError(404,"hall not found!"));
        res.status(200).send(hall)
    }catch(err){
        next(err)
    }
};
export const getHalls=  async (req,res,next)=>{
    // const q = req.query;
    // const filters = {
    //     ...(q.userId && {userId: q.userId}),
    //     ...(q.cat && {cat: q.cat}),
    //     ...((q.min || q.max) && {priceRange:{ ...(q.min && { $gt: q.min }), ...(q.max && {$lt: q.max})},}),
    //     ...(q.search && {title: { $regex: q.search, $options: "i"}}),
    // }

    try {
       // const halls = await Hall.find(filters).sort({[q.sort]: -1 }); //to get the latest ones
        const halls = await Hall.find({placeId:req.params.placeId});
        res.status(200).send(halls)
    }catch(err){
        next(err)
    }
};