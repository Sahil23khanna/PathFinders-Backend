const mongoose = require('mongoose')

const enrollmentSchema = mongoose.Schema({
   autoId:{type:Number, default:1},
   userId:{type:mongoose.Schema.Types.ObjectId , ref:"userModel" , default:null},
   mentorshipId:{type:mongoose.Schema.Types.ObjectId , ref:"mentorshipProgramModel" , default:null},
   totalAmount: {type:Number},
   razorpayOrderId: {type:String, default:""},
   paymentType: {type:String, default:""},
   paymentStatus:{type:String, default:""},
   status:{type:Number, default:1}, //1->pending, 2->approve, 3->decline, 4-> complete
   createdAt:{type:Date, default:Date.now()}
})

module.exports = mongoose.model("enrollmentModel" , enrollmentSchema)