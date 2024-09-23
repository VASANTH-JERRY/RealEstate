const jwt = require("jsonwebtoken")

const authenticateToken = (req,res,next) =>
{
    try {
        const { token } = req.cookies;

        if(!token)
            res.status(404).json({error:"Token not found"})

        const decode = jwt.verify(token,process.env.jWT_SECRET)

        req.user = decode.id;
        next()
    } catch (error) {
        
        res.status(401).json({error:"Authenticate Error"})
    }
    
}

module.exports = {authenticateToken}
