const Listing  = require("../models/listingModel.js")

const createListing = async(req,res) =>
{
    try {
        const newListing = await Listing.create(req.body);
        console.log(newListing)
        return res.status(201).json(newListing)
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal Server error"})
    }
}

const getListing = async(req,res) =>
{
    try {
        const userId = req.user;
        const id = req.params.id;

        if(userId !== id)
        {
            return res.json({error:"You are not authorised to do this action"})
        }

        const allListings = await Listing.find({useRef:req.params.id})
        if(!allListings)
        {
            return res.status(404).json({errro:"Listing not found"})
        }

        return res.json(allListings)
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal Server error"})
    }
}

const deleteListing = async(req,res) =>
{
    try {
        const id = req.params.id;
        const isListing = await Listing.findById(id);
        if(!isListing)
            return res.status(404).json({error:"Listing Not Found"});

        await Listing.findByIdAndDelete(id);

        return res.status(200).json({message:"Listing deleted Successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal Server error"})
    }
}

const getListingById = async(req,res) =>
{
    try {
        const id = req.params.id;

        const listing = await Listing.findById(id);

        if(!listing)
        {
            return res.status(404).json({error:"Listing Not found"});
        }

        return res.status(200).json(listing);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal Server error"})
    }
}

const updateListing = async(req,res) =>
{
    try {
        const id = req.params.id;
        const userId = req.user;
        const isListing = await Listing.findById(id);

        if(!isListing)
        {
            return res.status(404).json({error:"Listing NOt found"})
        }

        if(userId.toString() !== isListing.useRef.toString())
            return res.status(401).json({error:"You cannot authorised to do this"})

        const updatedListing = await Listing.findByIdAndUpdate(id,req.body,{
            new:true
        })

        return res.status(200).json({message:"Listing Updated Successfully",updatedListing})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal Server error"})
    }
}

const getSearchListing = async(req,res) =>
{
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        let offer = req.query.offer

        if(offer === undefined || offer === "false")
            offer = {$in:['true',"false"]}

        let furnished = req.query.furnished

        if(furnished === undefined || furnished === "false")
            furnished = {$in:['true',"false"]}

        let parking = req.query.parking

        if(parking === undefined || parking === "false")
            parking = {$in:['true','false']}

        let type = req.query.type

        if(type === undefined || type === "all")
            type = {$in:['sale','rent']}

        const searchTerm = req.query.searchTerm || ""

        const sort = req.query.sort || "createdAt";

        const order = req.query.order || 'desc';

        const listings = await Listing.find(
            {
                name:{$regex : searchTerm,$options:"i"},
                offer,
                furnished,
                parking,
                type
            }
        )
        .sort({[sort]:order})
        .limit(limit)
        .skip(startIndex)

        return res.status(200).json(listings)

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Internal Server error"}) 
    }
}


module.exports = {createListing,getListing,deleteListing,getListingById,updateListing,getSearchListing}