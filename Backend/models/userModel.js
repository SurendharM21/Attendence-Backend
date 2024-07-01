const mongoose = require('mongoose');
const validator = require("validator")
const jwt =require("jsonwebtoken")
const bcrypt =require("bcrypt")
const crypto = require("crypto");
const { type } = require('os');
const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Please enter name']
    },
    email:{
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        select: false
    },
    role :{
        type: String,
        default: 'user'
    },
    paidLeave:{
        type: Number,
        default: 1
    },
    sickLeave:{
        type: Number ,
        default:1     
    },
    createdAt :{
        type: Date,
        default: Date.now
    },
    holidays:[
        {
           date:{
            type: Date
           } ,
           eventName :{
            type: String
           }
        }
    ]

})

userSchema.methods.getJwtToken = function (){
   return  jwt.sign({id:this.id},process.env.JWT_SECRET,{ expiresIn:process.env.JWT_EXPIRES})

}

userSchema.methods.isValidatePassword = async function(enPassword){
     
     return bcrypt.compare(enPassword,this.password)
   
}

// userSchema.methods.getresetPasswordToken = function (){

//     const token = crypto.randomBytes(20).toString('hex');

    
//     this.resetPasswordToken =  crypto.createHash('sha256').update(token).digest('hex');

//     this.resetPasswordTokenExpire = Date.now() + 20 * 60 * 1000;

//     return token

// }

module.exports = mongoose.model("user",userSchema)
