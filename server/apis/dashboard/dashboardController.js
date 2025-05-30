const topicModel = require("../topic/topicModel")
const mentorshipProgramModel = require('../mentorshipProgram/mentorshipProgramModel')
const mentorModel = require("../mentor/mentorModel")
const studentModel = require("../student/studentModel")
const feedbackModel = require("../feedback/feedbackModel")
const enrollmentModel = require('../enrollment/enrollmentModel')

dashboard=async (req,res)=>{
    try{
        let totalTopic=await topicModel.countDocuments().exec()
        let totalfeedback = await feedbackModel.countDocuments().exec()
        let totalstudent=await studentModel.countDocuments().exec()
        let totalmentor=await mentorModel.countDocuments().exec()
        let totalenrollment = await enrollmentModel.countDocuments().exec()

        let totalmentorshipProgram=await mentorshipProgramModel.countDocuments().exec()
        let activementorshipProgram=await mentorshipProgramModel.countDocuments({status:true}).exec()
        let inActivementorshipProgram=await mentorshipProgramModel.countDocuments({status:false}).exec()

        // console.log(totalBrand, totalProduct, totalCategory, totalOrder, totalCustomers);
        res.json({
            status:200,
            success:true,
            message:"Dashboard loaded!!",
            totalTopic,
            totalstudent,
            totalmentor,
            totalfeedback,
            totalenrollment,
            mentorshipProgram:{
                total:totalmentorshipProgram,
                activementorshipProgram,
                inActivementorshipProgram
            }
            
        })
    }
    catch(err){
        res.json({
            status:500,
            success:false,
            message:"Internal server error"
        })
    }
}

module.exports={dashboard}

