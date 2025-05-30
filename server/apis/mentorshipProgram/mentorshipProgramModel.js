const mongoose = require('mongoose')

const mentorshipProgramSchema = mongoose.Schema({
   autoId:{type:Number, default:1},
   mentor:{type:mongoose.Schema.Types.ObjectId , ref:"userModel" , default:null},
   topics:[{type:mongoose.Schema.Types.ObjectId, ref:"topicModel" , default:null}],
   sessionDate:{type:String , default:""},
   meetingLink:{type:String , default:""},
   duration:{type:Number , default:60},
   rating:{type:Number, default:0},  
   price:{type:Number, default:0},
   status:{type:Boolean, default:true},
   createdAt:{type:Date, default:Date.now()}
   
})

module.exports = mongoose.model("mentorshipProgramModel" , mentorshipProgramSchema)