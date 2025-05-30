const mongoose = require('mongoose')

const feedbackSchema = mongoose.Schema({
   autoId:{type:Number, default:1},
   mentorshipId:{type:mongoose.Schema.Types.ObjectId , ref:"mentorshipProgramModel" , default:null},
   addedById:{type:mongoose.Schema.Types.ObjectId, ref:"userModel" , default:null},
   message:{type:String , default:""},
   rating:{type:Number , default:0},
   status:{type:Boolean, default:true},
   createdAt:{type:Date, default:Date.now()}
})

module.exports = mongoose.model("feedbackModel" , feedbackSchema)