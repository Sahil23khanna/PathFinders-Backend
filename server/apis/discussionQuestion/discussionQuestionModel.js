const mongoose = require('mongoose')

const discussionQuestionSchema = mongoose.Schema({
   autoId:{type:Number, default:1},
   title:{type:String , default:""},
   description:{type:String , default:""},
   tags:[{type:String , default:""}],
   addedById:{type:mongoose.Schema.Types.ObjectId, ref:"userModel" , default:null},
   status:{type:Boolean, default:true},
   createdAt:{type:Date, default:Date.now()}
   
})

module.exports = mongoose.model("discussionQuestionModel" , discussionQuestionSchema)