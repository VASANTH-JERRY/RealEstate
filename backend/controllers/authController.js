const User = require("../models/userModel.js")
const bcryptjs  = require("bcryptjs")
const jwt = require('jsonwebtoken')
const userSignUp =async(req,res)=>
{
    try {
        const {userName,email,password} = req.body

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if(!emailRegex.test(email))
            return res.status(403).json({error:"Invalid email format"})

        const isUserName = await User.findOne({userName})

        if(isUserName)
            return res.status(409).json({error:"userName already exists"})

        const isUser = await User.findOne({email})

        if(isUser)
            return res.status(409).json({error:"Email already exists"})

        const hashedPassword = bcryptjs.hashSync(password,10)

        const newUser = await User.create({
            userName,
            email,
            password:hashedPassword
        })
        
        const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:"15d"})

        res.cookie("token",token,{
            maxAge:15*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict"
        })

        return res.status(200).json( { _id:newUser._id,
            userName:newUser.userName,
            email:newUser.email})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
}

const userLogin = async(req,res) =>
{
    try {
        const {email,password} = req.body

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if(!emailRegex.test(email))
            return res.status(403).json({error:"Invalid email format"})

        const isUser = await User.findOne({email})

        if(!isUser)
            return res.status(409).json({error:"User not Found"})

        const validPassword = bcryptjs.compareSync(password,isUser.password)

        if(!validPassword)
            return res.status(409).json({error:"Invalid Password"})

        const token = jwt.sign({id:isUser._id},process.env.JWT_SECRET,{expiresIn:"15d"})

        res.cookie("token",token,{
            maxAge:15*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict"
        })

        const {password:pass,...rest} = isUser._doc;

        return res.status(201).json(rest)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
}

const googleAuth = async(req,res) =>
{
    try {
        const {userName,email} = req.body;
        const user = await User.findOne({email:req.body.email});
        if(user)
        {
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"15d"})

            const {password:pass,...rest} = user._doc;

            res.cookie("token",token,{
                maxAge:15*24*60*60*1000,
                httpOnly:true,
                sameSite:"strict"
            }).status(200).json(rest)
        }
        else
        {
            const generatedPassword =Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User(
                {
                    userName:req.body.userName.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4),
                    email:req.body.email,
                    password:hashedPassword,
                    avatar:req.body.photo
                }
            )

            await newUser.save();

            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:"15d"})

            const {password:pass,...rest} = newUser._doc;

            res.cookie("token",token,{
                maxAge:15*24*60*60*1000,
                httpOnly:true,
                sameSite:"strict"
            }).status(200).json(rest)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
}

const signOut = async(req,res) =>
{
    try {
        res.clearCookie('token')
        return res.status(200).json({message:"Signed Out Successfully"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"Internal Server Error"})
    }
}

module.exports = {userSignUp,userLogin,googleAuth,signOut}