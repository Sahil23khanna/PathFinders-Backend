
const discussionRepliesModel = require('./discussionRepliesModel')


// Adding Discussion Replies
add = (req, res) =>{
    
    let formData = req.body
    let validation = ""

    if (!formData.text) {
        validation+=" Reply is required "
    }

    if (!formData.discussionId) {
        validation+="discussion Id is required "
    }

    if (!!validation.trim()) {
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    
    else{
    discussionRepliesModel.findOne({userId:req.decoded.userId , discussionId:formData.discussionId})
    
    .then( async (discussionRepliesData)=>{
    
        if (!discussionRepliesData) {
            
            let discussionRepliesObj = new discussionRepliesModel()
            let total = await discussionRepliesModel.countDocuments().exec()
            
            discussionRepliesObj.autoId = total+1
           discussionRepliesObj.addedById = req.decoded.userId
           discussionRepliesObj.discussionId = formData.discussionId
           discussionRepliesObj.text = formData.text
            discussionRepliesObj.save()
        
            .then((discussionRepliesData)=>{
                res.json({
                   status:200,
                   success:true,
                   message:"Discussion Reply Added",
                   data:discussionRepliesData
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
                message:"Discussion Reply of this question exists.",
                data:discussionRepliesData
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


// fetching all replies
all = (req,res)=>{

    let formData = req.body
    let limit = formData.limit
    let currentPage = formData.currentPage
    delete formData.limit
    delete formData.currentPage
    
    discussionRepliesModel.find(formData)
    .populate({path:"addedById" , select: "name email" })
    .populate({path:"discussionId" , select:"title description tags"})
    .limit(limit)
    .skip((currentPage-1)*limit)
    
    .then(async(discussionRepliesData)=>{
        if(discussionRepliesData.length>0){
            let total=await discussionRepliesModel.countDocuments().exec()
            res.json({
                status:200,
                success:true,
                message:"Discussion Reply loaded",
                total:total,
                data:discussionRepliesData
            })
        }

        else{
            res.json({
                status:404,
                success:false,
                message:"No discussion Reply Found!!",
                data:discussionRepliesData
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


// to fetch single discussion reply detail
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
       discussionRepliesModel.findOne({_id:formData._id})
      .populate({path:"addedById" , select:"name email"})
      .populate({path:"discussionId" , select:"title description tags"})

       .then((discussionRepliesData)=>{
          if (!discussionRepliesData) {
            res.json({
                status:404,
                success:false,
                message:"No discussion Reply Found "
            })
          }
          else{
            res.json({
                status:200,
                success:true,
                message:"discussion Reply Found ",
                data:discussionRepliesData
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
    
        discussionRepliesModel.findOne({_id:formData._id})
        .then(async(discussionRepliesData)=>{
            if(!discussionRepliesData){
                res.json({
                    status:404,
                    success:false,
                    message:"No discussion Reply found!!"
                })
            }
            else{ 

                if(!!formData.title){
                    discussionRepliesData.text = formData.text 
                }
        
             discussionRepliesData.save() 

               .then((discussionRepliesData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"discussion Reply updated successfully!!",
                        data:discussionRepliesData
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
        discussionRepliesModel.findOne({_id:formData._id})
        .then((discussionRepliesData)=>{
            if(!discussionRepliesData){
                res.json({
                    status:404,
                    success:false,
                    message:"No discussion Reply found!!"
                })
            }else{
           
               discussionRepliesData.status=formData.status 
               discussionRepliesData.save()
               .then((discussionRepliesData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"Status updated successfully",
                        data:discussionRepliesData
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