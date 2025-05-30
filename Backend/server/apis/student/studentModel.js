const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
   autoId:{type:Number, default:1},
   userId:{type:mongoose.Schema.Types.ObjectId , ref:"userModel" , default:null},
   contact:{type:Number , default:""},
   profile:{type:String, default:"no-pic.jpg"},
   educationLevel:{type:String, default:""}, 
   topicInterested:[{type:mongoose.Schema.Types.ObjectId , ref:"topicModel" , default:null}],
   status:{type:Boolean, default:true},
   createdAt:{type:Date, default:Date.now()}
})

module.exports = mongoose.model("studentModel" , studentSchema)