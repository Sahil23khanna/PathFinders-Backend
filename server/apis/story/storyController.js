const storyModel = require("./storyModel")

// Adding story
add = (req,res)=>{

    let formData = req.body
    let validation = ""

    if (!formData.title) {
        validation+="Title is required !"
    }
    if (!formData.story) {
        validation+="story content is required !"
    }
    if (!!validation.trim()) {
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }

    else{
        storyModel.findOne({title:formData.title})

        .then( async (storyData)=>{

            if (!storyData) {
                
                let storyObj = new storyModel()
                let total = await storyModel.countDocuments().exec()
                storyObj.autoId = total+1
                storyObj.title = formData.title
                storyObj.story = formData.story
                storyObj.addedById = req.decoded.userId
                storyObj.save()

                .then((storyData)=>{
                    res.json({
                       status:200,
                       success:true,
                       message:"story Added with Title",
                       data:storyData
                   })
               })
               
               .catch((err)=>{
             //   console.log(err);   
                   res.json({
                       status:500,
                       success:false,
                       message:"Internal server error !",
                       error:err
                   })
               })
            }

            else{
                res.json({
                    status:200,
                    success:true,
                    message:"Story title already exists",
                    data:storyData
                })
            }
        })

        .catch((err)=>{
          //  console.log(err);
            res.json({
                status:500,
                success:false,
                message:"Internal Server Error !",
                error:err
            })
        })
    }
    
}


// Fetching Mentor Stories
all = (req,res)=>{

    let formData = req.body
    let limit = formData.limit
    let currentPage = formData.currentPage
    delete formData.limit
    delete formData.currentPage
    
    storyModel.find(formData)
    .populate({path:"addedById" , select: "name email" })
    .limit(limit)
    .skip((currentPage-1)*limit)
    
    .then(async(storyData)=>{
        if(storyData.length>0){
            let total=await storyModel.countDocuments().exec()
            res.json({
                status:200,
                success:true,
                message:"story loaded",
                total:total,
                data:storyData
            })
        }

        else{
            res.json({
                status:404,
                success:false,
                message:"No story Found!!",
                data:storyData
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


// to fetch single story detail
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
       storyModel.findOne({_id:formData._id})
      .populate({path:"addedById" , select:"name email"})

       .then((storyData)=>{
          if (!storyData) {
            res.json({
                status:404,
                success:false,
                message:"No story Found !"
            })
          }
          else{
            res.json({
                status:200,
                success:true,
                message:"story Found !",
                data:storyData
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


// updating story 
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
    
        storyModel.findOne({_id:formData._id})
        .then(async(storyData)=>{
            if(!storyData){
                res.json({
                    status:404,
                    success:false,
                    message:"No story found!!"
                })
            }
            else{ 

                if(!!formData.title){
                    storyData.title = formData.title 
                }

                if(!!formData.story){
                    storyData.story = formData.story
                }
        
             storyData.save() 

               .then((storyData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"story updated successfully!!",
                        data:storyData
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
        storyModel.findOne({_id:formData._id})
        .then((storyData)=>{
            if(!storyData){
                res.json({
                    status:404,
                    success:false,
                    message:"No story found!!"
                })
            }else{
           
               storyData.status=formData.status 
               storyData.save()
               .then((storyData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"Status updated successfully",
                        data:storyData
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