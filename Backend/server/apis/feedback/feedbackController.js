const mentorshipProgramModel = require('../mentorshipProgram/mentorshipProgramModel')
const feedbackModel = require('./feedbackModel')


// Adding feedback/rating
add = (req, res) =>{
    
    let formData = req.body
    let validation = ""
    
    if (!formData.mentorshipId) {
        validation+="Mentorship Id is required "
    }
    if (!formData.rating) {
        validation += "rating is required"
    } 


    if (!!validation.trim()) {
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    
    else{
    feedbackModel.findOne({addedById:req.decoded.userId , mentorshipId:formData.mentorshipId})
    
    .then( async (feedbackData)=>{
    
        if (!feedbackData) {
            
            let feedbackObj = new feedbackModel()
            let total = await feedbackModel.countDocuments().exec()
            feedbackObj.autoId = total+1
            feedbackObj.addedById = req.decoded.userId
            feedbackObj.mentorshipId = formData.mentorshipId
            feedbackObj.message = formData.message
            feedbackObj.rating = formData.rating

            feedbackObj.save()
            .then(async (feedbackData)=>{
                   feedbackModel.find({ mentorshipId:formData.mentorshipId })
                   .then((ratingData)=>{
                        let sum = 0;
                        for (let i = 0; i < ratingData.length; i++) {
                            console.log(ratingData[i]);
                            
                            sum += Number(ratingData[i].rating);
                        }

                        let avgRating = (sum / ratingData.length).toFixed(2)
                        mentorshipProgramModel.findOne({_id:formData.mentorshipId})

                        .then((mentorshipData)=>{
                            mentorshipData.rating=avgRating
                            mentorshipData.save()
                            .then((mentorshipData)=>{
                                res.json({
                                    status:200,
                                    success:true,
                                    message:"feedback added",
                                    data:feedbackObj,
                                    mentorshipData
                                })
                            })
                            .catch((err)=>{
                                console.log(err);
                                
                                res.json({
                                    status:500,
                                    success:false,
                                    message:"Internal Server Error !",
                                    error:err.message
                                })
                            })
                        })

                        .catch((err)=>{
                            console.log(err);
                            
                            res.json({
                                status:500,
                                success:false,
                                message:"Internal Server Error !",
                                error:err.message
                            })
                        })
                    })

                    .catch((err)=>{
                            console.log(err);
                            
                            res.json({
                                status:500,
                                success:false,
                                message:"Internal Server Error !",
                                error:err.message
                            })
                        })
                    
           
            })
        .catch((err)=>{
            console.log(err);
            
            res.json({
                status:500,
                success:false,
                message:"Internal Server Error !",
                error:err.message
            })
        })
    
     }

        else{
            res.json({
                status:200,
                success:true,
                message:"Same user has rated the same program already ",
                data:feedbackData
            })
        }
    })

    .catch((err)=>{
        console.log(err);
        
        res.json({
            status:500,
            success:false,
            message:"Internal Server Error !",
            error:err.message
        })
    })

} 
}


// Fetching feedbacks
all = (req,res)=>{

    let formData = req.body
    let limit = formData.limit
    let currentPage = formData.currentPage
    delete formData.limit
    delete formData.currentPage
    
    feedbackModel.find(formData)
   // .populate({path:"mentorshipId" , select: "mentor topics" })
    .populate({path:"addedById" , select:"name email"})
    .limit(limit)
    .skip((currentPage-1)*limit)
    
    .then(async(feedbackData)=>{
        if(feedbackData.length>0){
            let total=await feedbackModel.countDocuments().exec()
            res.json({
                status:200,
                success:true,
                message:"feedback loaded",
                total:total,
                data:feedbackData
            })
        }

        else{
            res.json({
                status:404,
                success:false,
                message:"No feedback Found!!",
                data:feedbackData
            })
        }
    })

    .catch((err)=>{
        res.json({
            status:500,
            success:false,
            message:"Internal server error",
            error:err
        })
    })
}


// to fetch single feedback
single = (req,res)=>{

    let validation = ""
    let formData = req.body
    
    if (!formData._id) {
        validation+="_id is required ! "
    }

    if (!!validation.trim()) {
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }

    else{
       feedbackModel.findOne({_id:formData._id})
      .populate({path:"addedById" , select:"name email"})
    //  .populate({path:"mentorshipId" , select:"mentor topics"})

       .then((feedbackData)=>{
          if (!feedbackData) {
            res.json({
                status:404,
                success:false,
                message:"No feedback Found !"
            })
          }
          else{
            res.json({
                status:200,
                success:true,
                message:"feedback Found !",
                data:feedbackData
            })
          }
       })
       .catch((err)=>{
        res.json({
            status:500,
            success:false,
            message:"Internal server error",
            error:err
        })
       })
    }
}


// deleting feedback
deletefeedback = (req,res)=>{
    let validation=""
    let formData=req.body 
    if(!formData._id){
        validation+="_id is required"
    }
    if(!!validation.trim()){
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }else{
        feedbackModel.findOne({_id:formData._id})
        .then((feedbackData)=>{
            if(!feedbackData){
                res.json({
                    status:404,
                    success:false,
                    message:"No feedback found!!!"
                })
            }else{
                feedbackModel.deleteOne({_id:formData._id})
                .then(()=>{
                    res.json({
                        success:true,
                        status:200,
                        message:"feedback deleted"
                    })
                })
                .catch((err)=>{
                    res.json({
                        status:500,
                        success:false,
                        message:"Internal server error",
                        error:err
                    })
                })
            }         
        })
        .catch((err)=>{
            res.json({
                status:500,
                success:false,
                message:"Internal server error",
                error:err
            })
        })
    }
}



module.exports = {add , all , single , deletefeedback}