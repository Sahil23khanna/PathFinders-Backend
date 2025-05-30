const mongoose = require('mongoose')

const storySchema = mongoose.Schema({

  autoId:{type:Number , default:1},
  addedById: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", default: null },
  title:{type:String , default:""},
  story:{type:String , default:""},
  status:{type:Boolean, default:true},
  createdAt:{type:Date, default:Date.now()}

})

module.exports = mongoose.model("storyModel",storySchema)