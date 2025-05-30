const mentorshipProgramModel = require('../mentorshipProgram/mentorshipProgramModel')


// Adding Mentorship Program
add = (req, res) =>{
    
    let formData = req.body
    let validation = ""
    
    if (!formData.topics) {
        validation+="Topics are required "
    }

    if (!formData.sessionDate) {
        validation+="session Date is required "
    }

    if (!formData.meetingLink) {
        validation+= "meeting Link is required "
    } 

    if (!formData.duration) {
        validation+= "Duration is required "
    }

   /*  if(!formData.price){
        validation+="price is required"
    } */

    if (!!validation.trim()) {
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    
    else{
    formData.topics = formData.topics.sort();
    mentorshipProgramModel.findOne({mentor:req.decoded.userId, topics: { $all: formData.topics, $size: formData.topics.length }})
    
    .then( async (mentorshipProgramData)=>{
    
        if (!mentorshipProgramData) {
            
            let mentorshipProgramObj = new mentorshipProgramModel()
            let total = await mentorshipProgramModel.countDocuments().exec()
            
            mentorshipProgramObj.autoId = total+1
            mentorshipProgramObj.mentor = req.decoded.userId
            mentorshipProgramObj.sessionDate=formData.sessionDate
            mentorshipProgramObj.meetingLink = formData.meetingLink
            mentorshipProgramObj.duration = formData.duration
            mentorshipProgramObj.topics = formData.topics
            mentorshipProgramObj.price = formData.price

            mentorshipProgramObj.save()
        
            .then((mentorshipProgramData)=>{
                res.json({
                   status:200,
                   success:true,
                   message:"mentorship Program Added!!",
                   data:mentorshipProgramData
               })
           })
           
           .catch((err)=>{
               res.json({
                   status:500,
                   success:false,
                   message:"Internal server error!",
                   error:err
               })
           })
     }

        else{
            res.json({
                status:200,
                success:true,
                message:"mentorship Program already exist",
                data:mentorshipProgramData
            })
        }
    })

    .catch((err)=>{
        res.json({
            status:500,
            success:false,
            message:"Internal Server Error !",
            error:err
        })
    })
} 
}


// Fetching all mentorship programs
all = (req,res)=>{
    let formData = req.body
    let limit = formData.limit
    let currentPage = formData.currentPage
    delete formData.limit
    delete formData.currentPage
    let filter = {...formData}

    mentorshipProgramModel.find(filter)

   .populate({path:"mentor" , select: "name email" })
   .populate({path:"topics" , select:"topic description"})
   

    .limit(limit)
    .skip((currentPage-1)*limit)
    
    .then(async(mentorshipProgramData)=>{
        if(mentorshipProgramData.length>0){
            let total=await mentorshipProgramModel.countDocuments(filter).exec()
            res.json({
                status:200,
                success:true,
                message:"mentorship Program loaded",
                total:total,
                data:mentorshipProgramData
            })
        }

        else{
            res.json({
                status:404,
                success:false,
                message:"No mentorship Program Found!!",
                data:mentorshipProgramData
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


// to fetch single mentorship detail
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
       mentorshipProgramModel.findOne({_id:formData._id})
       .populate({path:"mentor" , select:"name email"})
       .populate({path:"topics" , select:"topic description"})

       .then((mentorshipProgramData)=>{
          if (!mentorshipProgramData) {
            res.json({
                status:404,
                success:false,
                message:"No mentorship Program Found !"
            })
          }
          else{
            res.json({
                status:200,
                success:true,
                message:"mentorship Program Found !",
                data:mentorshipProgramData
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


// updating Mentorship Program
update=(req,res)=>{
    let formData=req.body 
    let validation=""
    if(!formData._id){
        validation+="_id is required"
    }

    if(!!validation.trim()){
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    
      else{
    
        mentorshipProgramModel.findOne({_id:formData._id})
        .then(async(mentorshipProgramData)=>{
            if(!mentorshipProgramData){
                res.json({
                    status:404,
                    success:false,
                    message:"No mentorship Program found!!"
                })
            }
            else{ 

                if(!!formData.sessionDate){
                    mentorshipProgramData.sessionDate= formData.sessionDate 
                }

                if(!!formData.meetingLink){
                    mentorshipProgramData.meetingLink = formData.meetingLink
                }

                if (!!formData.duration) {
                    mentorshipProgramData.duration = formData.duration
                }
 
                if (!!formData.topics) {
                    mentorshipProgramData.topics = formData.topics
                }
                
                mentorshipProgramData.save() 
 
               .then((mentorshipProgramData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"mentorshipProgram updated successfully!!",
                        data:mentorshipProgramData
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


// changeStatus api
changeStatus=(req,res)=>{
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
        mentorshipProgramModel.findOne({_id:formData._id})
        .then((mentorshipProgramData)=>{
            if(!mentorshipProgramData){
                res.json({
                    status:404,
                    success:false,
                    message:"No mentorship Program found!!"
                })
            }else{
           
               mentorshipProgramData.status=formData.status 
               mentorshipProgramData.save()
               .then((mentorshipProgramData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"Status updated successfully",
                        data:mentorshipProgramData
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


module.exports = {add , all , single ,update, changeStatus}