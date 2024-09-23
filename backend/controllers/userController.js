const User = require("../models/userModel.js")
const bcryptjs = require("bcryptjs")

const updateUser = async(req,res) =>
{
    try {
        const userId = req.user;
        const id = req.params.id;

        if(userId !== id)
            return res.status(401).json({error:"You are not authorised to do this"})
        
        if(req.body.password)
            req.body.password = await bcryptjs.hashSync(req.body.password , 10)
        const updatedUser = await User.findByIdAndUpdate(userId,
            {
                $set:{
                    userName : req.body.userName,
                    email:req.body.email,
                    password:req.body.password,
                    avatar:req.body.avatar
                },
               
            } ,{new:true},
        )

        const {password:pass, ...rest} = updatedUser._doc;

        res.status(200).json(rest)
    } catch (error) {
       console.log(error);
       res.status(400).json({error:"Internal Server Error"}) 
    }
}

const deletedUser =async(req,res) =>
{
    try {
        const userId = req.user;
        const id = req.params.id;

        if(userId !== id)
        {
            return res.status(401).json({error:"You are not authorised to do this"})
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({message:"User deleted Successfully"})
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"Internal Server Error"}) 
    }
}

const getUserData = async(req,res) =>
{
    try {
        const id = req.params.id;

        const user = await User.findById(id);

        if(!user)
            return res.status(404).json({error:"User Not Found"})

        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(400).json({error:"Internal Server Error"}) 
    }
}

module.exports = {updateUser,deletedUser,getUserData}