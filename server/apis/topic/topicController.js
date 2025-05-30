const topicModel = require("./topicModel")
const {uploadImg} = require('../../utilities/helper')


// Adding topic
add = (req, res) =>{
    
    let validation = ""
    if (!req.body.topic) {
        validation+= "Topic Name is Required ! "
    }
    
    if(!req.file){
        validation+="Image is required"
    }

    if (!!validation.trim()) {
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    
    else{
    topicModel.findOne({topic:req.body.topic})
    
    .then( async (topicData)=>{
    
        if (!topicData) {
            
            let topicObj = new topicModel()
            let total = await topicModel.countDocuments().exec()
            
            topicObj.autoId = total+1
            topicObj.topic = req.body.topic
            topicObj.description=req.body.description

            try{
                let url=await uploadImg(req.file.buffer) 
                topicObj.image=url
            }
            catch(err){
                res.json({
                    status:500,
                    success:false,
                    message:"error while uploading image!!"
                })
            }
            
            topicObj.save()
        
            .then((topicData)=>{
                res.json({
                   status:200,
                   success:true,
                   message:"Topic Added!!",
                   data:topicData
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
                message:"Topic already exist with same name",
                data:topicData
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


// Fetch all topics
all = (req,res)=>{
    let formData = req.body
    let limit = formData.limit
    let currentPage = formData.currentPage
    delete formData.limit
    delete formData.currentPage

    topicModel.find(formData)
    .limit(limit)
    .skip((currentPage-1)*limit)
    
    .then(async (topicData)=>{
        if(topicData.length>0){
            let total=await topicModel.countDocuments(formData).exec()
            res.json({
                status:200,
                success:true,
                message:"topic loaded",
                total:total,
                data:topicData
            })
        }else{
            res.json({
                status:404,
                success:false,
                message:"No topic Found!!",
                data:topicData
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


// To fetch singe topic
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
       topicModel.findOne({_id:formData._id})
       .then((topicData)=>{
          if (!topicData) {
            res.json({
                status:404,
                success:false,
                message:"No topic Found !"
            })
          }
          else{
            res.json({
                status:200,
                success:true,
                message:"topic Found !",
                data:topicData
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


// updating topic
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
    }else{
    
        topicModel.findOne({_id:formData._id})
        .then(async(topicData)=>{
            if(!topicData){
                res.json({
                    status:404,
                    success:false,
                    message:"No topic found!!"
                })
            }else{
               
                if(!!formData.topic){
                    topicData.topic = formData.topic 
                }

                if(!!formData.description){
                    topicData.description = formData.description
                }
                if (req.file && req.file.buffer) {
                    try {
                        let imageUrl = await uploadImg(req.file.buffer); 
                        topicData.image = imageUrl;
                    } catch (err) {
                        return res.json({
                            status: 500,
                            success: false,
                            message: "Error while uploading image!",
                            error: err
                        });
                    }
                }
        
             topicData.save() 

               .then((topicData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"topic updated successfully!!",
                        data:topicData
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


// change Status api
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
        topicModel.findOne({_id:formData._id})
        .then((topicData)=>{
            if(!topicData){
                res.json({
                    status:404,
                    success:false,
                    message:"No topic found!!"
                })
            }else{
           
               topicData.status=formData.status 
               topicData.save()
               .then((topicData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"Status updated successfully",
                        data:topicData
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


module.exports = {add , all , single , update , changeStatus}
