import Place from "../models/place.model.js";
import Hall from "../models/hall.model.js"
import Package from "../models/hallPackage.model.js";
import createError from "../utils/createError.js";

export const createPackage =  async (req,res,next)=>{
    if(!req.isPlaceOwner) 
    return next(createError(403,"only placeowner can create halls!"));

    const newPackage = new Package({
        userId: req.userId,
        ...req.body,
    }); 
    try{
        const savedPackage = await newPackage.save();
        res.status(201).json(savedPackage)
    } catch (err){
        next(err);
    }

};
export const deletePackage=  async (req,res,next)=>{
    try {
        const hallpackage = await Package.findById(req.params.id);
        if(hallpackage.userId !== req.userId) 
            return next(createError(403,"you can delete only your package"));

            await Package.findByIdAndDelete(req.params.id);
            res.status(200).send("Package has been deleted!");
    }catch(err){
        next(err)
    }
};

export const getPackage=  async (req,res,next)=>{
    try {
        const hallpackage = await Package.findById(req.params.id);
        if(!hallpackage) next(createError(404,"Place not found!"));
        res.status(200).send(hallpackage)
    }catch(err){
        next(err)
    }
};
export const getPackages=  async (req,res,next)=>{
    const q = req.query;
    const filters = {
        ...(q.userId && {userId: q.userId}),
        ...(q.cat && {cat: q.cat}),
        ...((q.min || q.max) && {priceRange:{ ...(q.min && { $gt: q.min }), ...(q.max && {$lt: q.max})},}),
        ...(q.search && {title: { $regex: q.search, $options: "i"}}),
    }

    try {
       // const packages = await Hall.find(filters).sort({[q.sort]: -1 }); //to get the latest ones
        const packages = await Hall.find(filters)
        res.status(200).send(packages)
    }catch(err){
        next(err)
    }
};