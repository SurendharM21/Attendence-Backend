const errorhandler = require("../utils/errorhandler")
const jwt = require("jsonwebtoken")
const user = require("../models/userModel")

exports.isAuthenticated = async(req,res,next)=>{
    const {token} = req.cookies
    console.log("I the aurhenticated middeleware",token)
    console.log(token)
    if(!token)
    {
        return next(new errorhandler("Login First to continue",401))
    }
    const verifys = await jwt.verify(token,process.env.JWT_SECRET)
    if(!verifys)
        {
            return next(new errorhandler("un Authorized user",401))
        }
    req.user = await user.findById(verifys.id)
    next()
}

exports.auhtorizeRole = (...roles)=>{
  return   async(req,res,next)=>{
    console.log(req.user)
        if(!roles.includes(req.user.role))
        {
            return next(new errorhandler("Not Authorized to Access",401))
        }
        next()
    }
}