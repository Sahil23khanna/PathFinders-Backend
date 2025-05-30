const mongoose = require('mongoose')

const topicSchema = mongoose.Schema({
  autoId:{type:Number , default:1},
  description:{type:String , default:""},
  topic:{type:String, default:""},
  image:{type:String, default:"no-pic.jpg"},
  status:{type:Boolean, default:true},
  createdAt:{type:Date, default:Date.now()}
})

module.exports = mongoose.model("topicModel",topicSchema)