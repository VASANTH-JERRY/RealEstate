const mongoose = require("mongoose")

const {Schema } = require("mongoose")


const userSchema = new Schema(
    {
        userName:{
            type:String,
            required:true,
            unique:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true,
            
        },
        avatar:
        {
            type:String,
            default:"https://www.swanirmanconsultancy.in/wp-content/uploads/2023/04/userimg.jpg"
            
        }
    }
)

const User = mongoose.model("User",userSchema)

module.exports = User