const userModel = require('../user/userModel')
const mentorModel = require('../mentor/mentorModel')
const bcryptjs = require('bcryptjs')
const {uploadImg} = require('../../utilities/helper')

// Mentor Registration
register = (req,res)=>{
     
    let validation=""
    let formData=req.body 
    if(!formData.name){
        validation+="Name is required"
    }
    if(!formData.email){
        validation+=" email is required"
    }
    if(!formData.password){
        validation+=" password is required"
    }
    if(!formData.contact){
        validation+="contact is required"
    }
  
    if(!!validation.trim()){
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    else{
        userModel.findOne({email:formData.email})
        
        .then(async (userData)=>{
            if(!userData){
                //insert in userModel first 
                let userTotal=await userModel.countDocuments().exec()
                let userObj=new userModel()
                userObj.autoId=userTotal+1
                userObj.name=formData.name 
                userObj.email=formData.email 
                userObj.password=bcryptjs.hashSync(formData.password,10)  // password prob
                userObj.userType=2
                userObj.save()

                .then(async (userData)=>{
                    // insert in mentor Model
                    let mentorTotal = await mentorModel.countDocuments().exec()
                    let mentorObj = new mentorModel()
                    mentorObj.autoId = mentorTotal+1
                    mentorObj.contact = formData.contact
                    mentorObj.userId = userData._id
                    mentorObj.save()

                    .then((mentorData)=>{
                        res.json({
                            status:201,
                            success:true,
                            message:"mentor registered Successfully!",
                            mentorData,
                            userData
                        })
                    })
                    .catch((err)=>{
                        res.json({
                            status:500,
                            success:false,
                            message:"Internal server error!!"
                        })
                    })
                })

                .catch((err)=>{
                    res.json({
                        status:500,
                        success:false,
                        message:"Internal server error!!"
                    })
                })
            }
            else{
                res.json({
                    status:200,
                    success:false,
                    message:"User already exist",
                    data:userData
                })
            }
        })
        .catch((err)=>{
            res.json({
                status:500,
                success:false,
                message:"Internal server error!!"
            })
        })
    }
}


// Fetching all mentors
all = (req,res)=>{
    let formData = req.body
    let limit = formData.limit
    let currentPage = formData.currentPage
    delete formData.limit
    delete formData.currentPage
    
    mentorModel.find(formData)

    .populate({path:"userId" , select: "name email" })
    .populate({path:"topicInterested" , select:"topic description"})
    .limit(limit)
    .skip((currentPage-1)*limit)
    
    .then(async(mentorData)=>{
        if(mentorData.length>0){
            let total=await mentorModel.countDocuments().exec()
            res.json({
                status:200,
                success:true,
                message:"mentor loaded",
                total:total,
                data:mentorData
            })
        }

        else{
            res.json({
                status:404,
                success:false,
                message:"No mentor Found!!",
                data:mentorData
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


// to fetch single mentor detail
single = (req,res)=>{

    let validation = ""
    let formData = req.body
    
    if (!formData.userId) {
        validation+="userId is required ! "
    }

    if (!!validation.trim()) {
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }

    else{
       mentorModel.findOne({userId:formData.userId})
       .populate({path:"userId" , select:"name email"})
       .populate({path:"topicInterested" , select:"topic description"})

       .then((mentorData)=>{
          if (!mentorData) {
            res.json({
                status:404,
                success:false,
                message:"No mentor Found !"
            })
          }
          else{
            res.json({
                status:200,
                success:true,
                message:"mentor Found !",
                data:mentorData
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


// update api
update=(req,res)=>{
    let formData=req.body 
    userModel.findOne({_id:req.decoded.userId})
    .then((userData)=>{
        if(!userData){
            res.json({
                status:404,
                success:false,
                message:"No user found!!"
            })
        }
        else{
            if(!!formData.name){
                userData.name=formData.name
            }
            userData.save()
            .then((userData)=>{
                mentorModel.findOne({userId:req.decoded.userId})
                .then(async(mentorData)=>{
                    if(!mentorData){
                        res.json({
                            status:404,
                            success:false,
                            message:"No mentor found!!"
                        })
                    } 
                    else{
                        if(!!formData.profile){
                            mentorData.profile=formData.profile
                        }
                        if(!!formData.contact){
                            mentorData.contact=formData.contact
                        }
                        if(!!formData.graduationYear) {
                            mentorData.graduationYear = formData.graduationYear
                        }
                        if(!!formData.currentJob) {
                            mentorData.currentJob = formData.currentJob
                        }
                        if(!!formData.company) {
                            mentorData.company = formData.company
                        }
                        if(!!formData.alumniStory) {
                            mentorData.alumniStory = formData.alumniStory
                        }
                        if (!!formData.experience) {
                            mentorData.experience = formData.experience
                        }
                      /*   if (formData.topicInterested) {
                                if (Array.isArray(formData.topicInterested)) {
                                    mentorData.topicInterested = formData.topicInterested;
                                } else {
                                    mentorData.topicInterested = [formData.topicInterested]; // Force to array
                                }
                            } */
                         if (!!formData.topicInterested) {
                            mentorData.topicInterested = formData.topicInterested
                         }    

                          if (req.file && req.file.buffer) {
                                try {
                                    const url = await uploadImg(req.file.buffer);
                                    mentorData.profile = url;
                                } catch (uploadErr) {
                                    return res.json({
                                        status: 500,
                                        success: false,
                                        message: "Error while uploading image!",
                                        error: uploadErr?.message
                                    });
                                }
                            }
                            
                        mentorData.save()

                        .then((mentorData)=>{
                            res.json({
                                status:200,
                                success:true,
                                message:"Profile updated",
                                userData,
                                mentorData
                            })
                        })
                        .catch((err)=>{
                            res.json({
                                status:500,
                                success:false,
                                message:err?.message
                            })
                        })
                    }                   
                })
                .catch((err)=>{
                    res.json({
                        status:500,
                        success:false,
                        message:err?.message
                    })
                })
                
            })
            .catch((err)=>{
                res.json({
                    status:500,
                    success:false,
                    message:err?.message
                })
            })
        }      
    })
    
}


// change Status api
changeStatus=(req,res)=>{
    let formData=req.body
    let validation=""
    if(!formData._id){
        validation+="_id is required"
    }
    if(formData.status==null || formData.status==undefined){
        validation+="Status is required"
    }
    if(!!validation){
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }else{
        userModel.findOne({_id:formData._id})
        .then((userData)=>{
            if(!userData){
                res.json({
                    status:404,
                    success:false,
                    message:"No user found!!"
                })
            }

            else{
               /*  userData.status=formData.status */
                if (formData.status === "Approved") {
                    userData.status = true;
                }
                if(formData.status=="Rejected"){
                    userData.status=false;
                }
                userData.save()
                .then((userData)=>{
                    mentorModel.findOne({userId:formData._id})
                    .then((mentorData)=>{
                        if(!mentorData){
                            res.json({
                                status:404,
                                success:false,
                                message:"No mentor found!!"
                            })
                        } 
                        else{
                            mentorData.status=formData.status
                            mentorData.save()
                            .then((mentorData)=>{
                                res.json({
                                    status:200,
                                    success:true,
                                    message:"Status updated",
                                    userData,
                                    mentorData
                                })
                            })
                            .catch((err)=>{
                                res.json({
                                    status:500,
                                    success:false,
                                    message:err?.message
                                })
                            })
                        }                   
                    })
                    .catch((err)=>{
                        res.json({
                            status:500,
                            success:false,
                            message:err?.message
                        })
                    })
                    
                })
                .catch((err)=>{
                    res.json({
                        status:500,
                        success:false,
                        message:err?.message
                    })
                })
            }      
        })
        
    }
    
}
    


module.exports = {register , all , single , update , changeStatus}