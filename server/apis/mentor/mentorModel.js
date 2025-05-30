const mongoose = require('mongoose')

const mentorSchema = mongoose.Schema({
   autoId:{type:Number, default:1},
   userId:{type:mongoose.Schema.Types.ObjectId , ref:"userModel" , default:null},
   contact:{type:Number , default:0},
   profile:{type:String, default:"no-pic.jpg"},
   graduationYear:{type:Number, default:0}, 
   currentJob:{type:String, default:""},
   /* topicInterested:[{type:String , default:""}], */
   topicInterested:[{type:mongoose.Schema.Types.ObjectId , ref:"topicModel" , default:null}],
   experience:{type:String , default:""},
   company:{type:String, default:""},
   alumniStory:{type:String, default:""},
   status: { type: String, enum: ['pending', 'Approved', 'Rejected'], default: 'pending' },
   createdAt:{type:Date, default:Date.now()}
})

module.exports = mongoose.model("mentorModel" , mentorSchema)