const userModel = require('../user/userModel')
const studentModel = require('../student/studentModel')
const bcryptjs = require('bcryptjs')
const {uploadImg} = require('../../utilities/helper')

// Student Registration
register = (req,res)=>{
     
    let validation=""
    let formData=req.body 
    if(!formData.name){
        validation+="Name is required"
    }
    if(!formData.email){
        validation+="email is required"
    }
    if(!formData.password){
        validation+="password is required"
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
                userObj.password=bcryptjs.hashSync(formData.password,10)  // password problem
                userObj.userType=3
                userObj.status=true
                userObj.save()

                .then(async (userData)=>{
                    // insert in studentModel
                    let studentTotal = await studentModel.countDocuments().exec()
                    let studentObj = new studentModel()
                    studentObj.autoId = studentTotal+1
                    studentObj.contact = formData.contact
                    studentObj.userId = userData._id
                    studentObj.save()

                    .then((studentData)=>{
                        res.json({
                            status:201,
                            success:true,
                            message:"Student registered Successfully!",
                            studentData,
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


// Fetch all students
all = (req,res)=>{

    let limit = req.body.limit
    let currentPage = req.body.currentPage
    delete req.body.limit
    delete req.body.currentPage

    studentModel.find(req.body)
    .populate({path:"userId", select:"name email"})
    .populate({path:"topicInterested" , select:"topic description"})
    .limit(limit)
    .skip((currentPage-1)*limit)

    .then(async(studentData)=>{

        if(studentData.length>0){
            let total=await studentModel.countDocuments().exec()
            res.json({
                status:200,
                success:true,
                message:"student loaded",
                total:total,
                data:studentData
            })
        }
        else{
            res.json({
                status:404,
                success:false,
                message:"No student Found!!",
                data:studentData
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


// Fetching single student detail
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
       studentModel.findOne({userId:formData.userId})
       .populate({path:"userId", select:"name email"})
       .populate({path:"topicInterested" , select:"topic description"})

       .then((studentData)=>{
          if (!studentData) {
            res.json({
                status:404,
                success:false,
                message:"No student Found !"
            })
          }
          else{
            res.json({
                status:200,
                success:true,
                message:"student Found !",
                data:studentData
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


// updating student detail
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
                studentModel.findOne({userId:req.decoded.userId})
                .then(async (studentData)=>{
                    if(!studentData){
                        res.json({
                            status:404,
                            success:false,
                            message:"No student found!!"
                        })
                    } 
                    else{
                        
                       /*  if(!!formData.profile){
                            studentData.profile=formData.profile
                        }  */

              if (req.file && req.file.buffer) {
            try {
                const url = await uploadImg(req.file.buffer);
                studentData.profile = url;
            } catch (uploadErr) {
                return res.json({
                    status: 500,
                    success: false,
                    message: "Error while uploading image!",
                    error: uploadErr?.message
                });
            }
        }

                        if(!!formData.contact){
                            studentData.contact=formData.contact
                        }
                        if(!!formData.educationLevel) {
                            studentData.educationLevel = formData.educationLevel
                        }
                          /*   if (formData.topicInterested) {
                                if (Array.isArray(formData.topicInterested)) {
                                    studentData.topicInterested = formData.topicInterested;
                                } else {
                                    studentData.topicInterested = [formData.topicInterested]; // Force to array
                                }
                            } */
                                if (!!formData.topicInterested) {
                                    studentData.topicInterested = formData.topicInterested
                                 } 


                        studentData.save()

                        .then((studentData)=>{
                            res.json({
                                status:200,
                                success:true,
                                message:"Profile updated",
                                userData,
                                studentData
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
                userData.status=formData.status
                userData.save()
                .then((userData)=>{
                    studentModel.findOne({userId:formData._id})
                    .then((studentData)=>{
                        if(!studentData){
                            res.json({
                                status:404,
                                success:false,
                                message:"No student found!!"
                            })
                        } 
                        else{
                            studentData.status=formData.status
                            studentData.save()
                            .then((studentData)=>{
                                res.json({
                                    status:200,
                                    success:true,
                                    message:"Status updated",
                                    userData,
                                    studentData
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