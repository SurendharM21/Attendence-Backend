const { Timestamp } = require("mongodb")
const mongoose =require("mongoose")

const attendenceSchema = new mongoose.Schema({

    user:{
        type: String,
        ref: "users"
    },
    email:{
        type:String,
        ref:"users"
    },
    status:{
        type:String,
        required: [true, 'Please enter status']
    },
    date:{
        type: Date,
        required: [true,'please enter date']
    },
    wfh:{
        type:String,
      
    },
    time:{
        type: Date,
    },
    logoutTime:{
        type:Date,
        default:''
    },
    reason:{
        type:String
    }
})

module.exports = mongoose.model("attendence",attendenceSchema)