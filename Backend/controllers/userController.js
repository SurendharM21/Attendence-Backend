const user = require("../models/userModel")
const errorhandler =require("../utils/errorhandler")
const bcrypt =require("bcrypt")
const nodemailer = require("nodemailer")
const crypto = require("crypto")
const moment =require("moment")
const attendenceModel = require("../models/attendenceModel")
exports.registerUser = async(req,res)=>{

    const {name,email,password,role} = req.body
console.log(req.body)
    const hashPass =  await bcrypt.hash(password,10)
    const newUser =  await user.create({
        name: name,
        email: email,
        password:hashPass,
        role:role
    })

    res.json({
        success: true,
        message:"The User Created",
        newUser
    })
}

exports.loginUser = async(req,res,next)=>{
    

    const {email,password} =req.body
    const luser = await user.findOne({email}).select("+password")
   
    if(!luser)
    {
        return next(new errorhandler("No User found",401))
    }
    if(!await luser.isValidatePassword(password))
    {
        return next(new errorhandler("email or password is wrong",401))
    }
    const token = await luser.getJwtToken()
    const options ={
        expires: new Date(Date.now()  + process.env.COOKIE_EXPIRES * 24 *60 *60 *100),
        httpOnly:true
    }

    res.cookie('token',token,options).json({
        success:true,
        message:"Logged in",
        token,
        luser
    })

}

exports.getAllUsers =async (req,res)=>{

    const allUsers =await user.find({"role":"user"})
    res.json({
        success:true,
        allUsers
    })
}

exports.getUser =async (req,res,next)=>{

     const {email} = req.params

    const users = await user.findOne({email})
    if(!users)
        {
            return(next(new errorhandler("No user Found",401)))
        }
    const attendence = await attendenceModel.find({email})
    if(!users)
    {
        return next(new errorhandler("No Users Found",404))
    }
  
    res.json({
        success:true,
        users,
        attendence
    })

}

exports.updateUser = async(req,res,next)=>{
    const {email,password}=req.body
    const hash = await bcrypt.hash(password,10)
    const newData ={
        name : req.body.name,
        password: hash
    }
    const luser = await user.findOne({email:email})

    if(!luser)
        {
            return next(new(errorhandler("No User Found",404)))
        }
    
    const uData = await user.findByIdAndUpdate(luser.id,newData,{new:true})
   

    res.json({
        success:true,
        uData
    })
}

exports.userProfile = async(req,res,next)=>{

    const {email} = req.params
    
    const profile = await user.findOne({email})
    if(!profile)
        {
            return next(new errorhandler("No user Found",401))
        }
console.log(profile)
    res.json({
        success:true,
        profile
    })
}

// exports.logoutUser = async(req,res)=>{
//     res.cookie("token",null,{
//         expires: new Date(Date.now()),
//         httpOnly:true
//     })
// }

// exports.forgotPassword = async(req,res,next)=>{

//     const {email} = req.body

//     const luser = await user.findOne({email})
//     console.log(luser)
//     if(!luser)
//         {
//             return next(new errorhandler("Not a valid user",401))
//         }
//     const token = await luser.getresetPasswordToken()

//     await luser.save({validateBeforeSave: false})

//     // const resetUrl = `http://localhost:8000/api/v1//users/forgotPassword/${token}`;
//     // var transport = nodemailer.createTransport({
//     //     host: "sandbox.smtp.mailtrap.io",
//     //     port: 2525,
//     //     auth: {
//     //       user: "6e9b35f0558b8c",
//     //       pass: "00607dee75a559"
//     //     }
//     //   });

//     //   const message = {
//     //       from: "sandbox.smtp.mailtrap.io",
//     //       to: "msdsuren07@getPossibleMiddlewareFilenames.com",
//     //       subject: "Reset Password",
//     //       text: resetUrl
//     //   }
  
//     //  await transport.sendMail(message)
    
//     res.json({token})
// }

// exports.resetPassword = async(req,res,next)=>{

//     const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    
//     const luser = await user.findOne({
//         resetPasswordToken,
//         resetPasswordTokenExpire: {
//             $gt : Date.now()
//         }
//     })
//     if(!luser)
//         {
//             return next(new errorhandler("Your token is expired",400))
//         }

//     if(req.body.password != req.body.confirmPassword)
//         {
//             return next(new errorhandler("Password and Confirm Password Not Matched",400))
//         }
//     const hash = await bcrypt.hash(req.body.password,10)
//     luser.password = hash
//     luser.resetPasswordToken = undefined
//     luser.resetPasswordTokenExpire = undefined
//    await luser.save({validateBeforeSave: false})
//     res.json({
//         message:"Hello World"
//     })
// }

// exports.changePassword = async(req,res,next)=>{

//     const id = req.user.id
//     console.log(id)
//     const luser = await user.findById(id).select("+password")
//     console.log(luser)
//     if(!await luser.isValidatePassword(req.body.oldpassword))
//         {
//             return(next(new errorhandler("Old Password is Wrong")))
//         }
//     const hash = await bcrypt.hash(req.body.newpassword,10)
//     luser.password = hash
//     await luser.save({validateBeforeSave:false})

//     res.json({
//         success:true,
//     })
// }

exports.deleteUser = async(req,res)=>{

    const {email} = req.body
    const luser = await user.findOneAndDelete({email})

    res.json({
        success:true,
        luser
    })
}

exports.updateOwnDetails = async(req,res,next)=>{

    const id =req.user.id
    const newDetails = {
        name: req.body.name,
        email: req.body.email
        }
    
    const luser = await user.findByIdAndUpdate(id,newDetails,{new:true})

    if(!luser)
        {
            return next(new errorhandler("Not a Valid User",401))
        }
}

exports.logout = async(req,res,next)=>{

 const {id} = req.params
 const {time}= req.body

const checkDetails = await attendenceModel.findById(id)

if(!checkDetails)
    {
        return next(new errorhandler("First give login an then Logout"))
    }
 const received_time = moment(time).toISOString()
 const todayDate= new Date()
todayDate.setHours(18,0,0,0)
const logoutTime = todayDate.toISOString()

if(received_time < logoutTime)
    {
        return next(new errorhandler("cannot log out before 6.00pm"))
    }
 checkDetails.logoutTime = received_time
 checkDetails.save()
res.json({
    success:true
})
}

exports.addHolidays = async(req,res)=>{

    const {date,eventName} = req.body

    let allUsers = await user.find()

    const newData  ={
        date:date,
        eventName: eventName
    }
    allUsers.map(async(user)=>{
        user.holidays.push(newData)
        await user.save()
    })
 console.log(newData);
    res.json({
        success:true
    })
}
