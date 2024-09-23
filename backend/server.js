const express = require("express")
const app = express()
const {mongoose} = require("mongoose")
const cookieparser = require("cookie-parser")
const dotenv = require("dotenv")
dotenv.config()

const authRoutes = require("./routes/authRoutes.js")
const userRoutes = require("./routes/userRoutes.js")
const listingRoutes = require("./routes/listingRoutes.js")

app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/auth",authRoutes)
app.use("/api/user/",userRoutes)
app.use("/api/listing/",listingRoutes)

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Database connected Successfully"))
.catch((err)=>console.error(err))

app.listen(process.env.PORT,()=>
{
    console.log(`Server connected to ${process.env.PORT} `)
})