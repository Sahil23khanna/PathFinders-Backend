const mongoose = require('mongoose')

const discussionRepliesSchema = mongoose.Schema({
   autoId:{type:Number, default:1},
   discussionId:{type:mongoose.Schema.Types.ObjectId , ref:"discussionQuestionModel" , default:null},
   addedById:{type:mongoose.Schema.Types.ObjectId , ref:"userModel" , default:null},
   text:{type:String , default:""},
   status:{type:Boolean, default:true},
   createdAt:{type:Date, default:Date.now()}
   
})

module.exports = mongoose.model("discussionRepliesModel" , discussionRepliesSchema)