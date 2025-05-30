const discussionQuestionModel = require('./discussionQuestionModel')

// Adding Discussion Questions
add = (req, res) =>{
    
    let formData = req.body
    let validation = ""

    if (!formData.title) {
        validation+=" Title is required "
    }

    if (!formData.description) {
        validation+="description is required "
    } 

    if (!formData.tags) {
        validation += "Tags are required "
    }

    if (!!validation.trim()) {
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    
    else{
    discussionQuestionModel.findOne({title:formData.title})
    
    .then( async (discussionQuestionData)=>{
    
        if (!discussionQuestionData) {
            
            let discussionQuestionObj = new discussionQuestionModel()
            let total = await discussionQuestionModel.countDocuments().exec()
            
            discussionQuestionObj.autoId = total+1
            discussionQuestionObj.addedById = req.decoded.userId
            discussionQuestionObj.title = formData.title
            discussionQuestionObj.description = formData.description
            discussionQuestionObj.tags = formData.tags
            

            discussionQuestionObj.save()
        
            .then((discussionQuestionData)=>{
                res.json({
                   status:200,
                   success:true,
                   message:"Discussion Question Added",
                   data:discussionQuestionData
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
                message:"Discussion Question with this title already exists.",
                data:discussionQuestionData
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


// fetching all questions
all = (req,res)=>{

    let formData = req.body
    let limit = formData.limit
    let currentPage = formData.currentPage
    delete formData.limit
    delete formData.currentPage
    // let filter = { ...formData, addedById: req.decoded.userId }

    discussionQuestionModel.find(formData)
    .populate({path:"addedById" , select: "name email" })
    .limit(limit)
    .skip((currentPage-1)*limit)
    
    .then(async(discussionQuestionData)=>{
        if(discussionQuestionData.length>0){
            let total=await discussionQuestionModel.countDocuments(formData).exec()
            res.json({
                status:200,
                success:true,
                message:"Discussion Question loaded",
                total:total,
                data:discussionQuestionData
            })
        }

        else{
            res.json({
                status:404,
                success:false,
                message:"No discussion Question Found!!",
                data:discussionQuestionData
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


// to fetch single discussion question detail
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
       discussionQuestionModel.findOne({_id:formData._id})
      .populate({path:"addedById" , select:"name email"})

       .then((discussionQuestionData)=>{
          if (!discussionQuestionData) {
            res.json({
                status:404,
                success:false,
                message:"No discussion Question Found !"
            })
          }
          else{
            res.json({
                status:200,
                success:true,
                message:"discussion Question Found !",
                data:discussionQuestionData
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


// updating discussion question
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
    
        discussionQuestionModel.findOne({_id:formData._id})
        .then(async(discussionQuestionData)=>{
            if(!discussionQuestionData){
                res.json({
                    status:404,
                    success:false,
                    message:"No discussionQuestion found!!"
                })
            }
            else{ 

                if(!!formData.title){
                    discussionQuestionData.title = formData.title 
                }

                if(!!formData.description){
                    discussionQuestionData.description = formData.description
                }

                if (!!formData.tags) {
                    discussionQuestionData.tags = formData.tags
                }
        
             discussionQuestionData.save() 

               .then((discussionQuestionData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"discussion Question updated successfully!",
                        data:discussionQuestionData
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
        discussionQuestionModel.findOne({_id:formData._id})
        .then((discussionQuestionData)=>{
            if(!discussionQuestionData){
                res.json({
                    status:404,
                    success:false,
                    message:"No discussion Question found!!"
                })
            }else{
           
               discussionQuestionData.status=formData.status 
               discussionQuestionData.save()
               .then((discussionQuestionData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"Status updated successfully",
                        data:discussionQuestionData
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


module.exports ={add , all , single ,update, changeStatus}