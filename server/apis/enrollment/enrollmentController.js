const enrollmentModel = require('./enrollmentModel')
const Razorpay=require("razorpay")

// Adding Enrollment
add = async (req, res) => {
    
    try {
        // Order Step
        if (req.body.step === "order") {
            let validationErrors = "";
            // Validate required fields
            if (!req.body.totalAmount) validationErrors += "Total Amount is required. ";
            if (!req.body.mentorshipId) validationErrors += "Mentor Ship iD is required. ";

            // Return validation errors
            if (validationErrors) {
                return res.json({
                    success: false,
                    status: 400,
                    message: validationErrors.trim(),
                });
            }
            enrollmentModel.findOne({userId:req.decoded.userId , mentorshipId:req.body.mentorshipId})
             .then( async (enrollmentData)=>{
                if (!enrollmentData) {
                       console.log(process.env.RAZORPAY_KEY_ID);
            
                    // Razorpay order creation
                    const razorpay = new Razorpay({
                        key_id: process.env.RAZORPAY_KEY_ID,
                        key_secret: process.env.RAZORPAY_KEY_SECRET,
                    });
                    
                    let totalAmount=req.body.totalAmount
                    const options = {
                        amount: totalAmount * 100, // Razorpay expects amount in paise
                        currency: "INR",
                        receipt: "receipt_order_" + new Date().getTime(),
                    };

                    const order = await razorpay.orders.create(options);
                    return res.json({
                        success: true,
                        status: 200,
                        message: "Razorpay order created",
                        order: order,
                        totalAmount: totalAmount,
                    });
                        
            }

                else{
                    res.json({
                        status:200,
                        success:true,
                        message:"Same user is enrolled in same program already ",
                        data:enrollmentData
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

        // Confirm Step
       else if (req.body.step === "confirm") {
            const total = await enrollmentModel.countDocuments();
            console.log(total);
            
            // Create new booking
            const newEnrollment = new enrollmentModel({
                autoId: total + 1,
                userId : req.decoded.userId,
                mentorshipId : req.body.mentorshipId,
                totalAmount: req.body.totalAmount,
                razorpayOrderId: req.body.razorpayOrderId,
                paymentType: 'online',
                paymentStatus: "paid",
            });

            console.log(newEnrollment);
            
            const savedEnrollment = await newEnrollment.save();

            // Fetch user details
            // const user = await User.findById(req.body.userId);
            // if (!user || !user.email) {
            //     return res.json({
            //         success: false,
            //         status: 404,
            //         message: "User email not found",
            //     });
            // }
            // const ngo = await User.findById(req.body.ngoId);
  
            
            // if (!ngo) {
            //     return res.json({
            //         success: false,
            //         status: 404,
            //         message: "ngo email not found",
            //     });
            // }
           
            // Send email confirmation
//             const transporter = nodemailer.createTransport({
//                 service: "Gmail",
//                 host: "smtp.gmail.com",
//                 port: 465,
//                 secure: true,
//                 auth: {
//                     user: process.env.USEREMAIL,
//                     pass: process.env.USERPASSWORD,
//                 },
//             });

//             await transporter.sendMail({
//                 from: `"🎶 Pet Ventage" <${process.env.USEREMAIL}>`,
//                 to: user.email,
//                 subject: "🎉 Thank you for your donation!",
//                 text: `Hello ${user.name}, your booking is confirmed! Get ready for an unforgettable experience.`,
//                 html: `
//                 <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 8px;">
//                   <h2 style="color: #4CAF50;">🎫 Donation Confirmation</h2>
//                   <p>Hi <strong>${user.name}</strong>,</p>
//                   <p>Your donation has been <strong style="color: #28a745;">successfully received to us</strong>!</p>
              
//                   <div style="margin: 20px 0; padding: 15px; background-color: #e8f5e9; border-left: 4px solid #4CAF50;">
                    
//                     Thank you for choosing <b>Pet Ventage</b>. We’re thankful for your help.</p>
//                   </div>
              
//                   <h3 style="margin-top: 30px;">🎟️ Donation Summary</h3>
//                   <ul style="list-style: none; padding-left: 0;">
//                     <li><strong>Ngo:</strong> ${ngo?.name}</li>

// <li><strong>Donation Time:</strong> ${new Date(savedDonation.createdAt).toLocaleString('en-IN', {
//                     weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
//                     hour: '2-digit', minute: '2-digit'
//                 })}</li>

//                     <li><strong>Total Paid:</strong> ₹${req.body.totalAmount}</li>
//                   </ul>
              
             
                  
              
                
//                   Thanks,<br>
//                   <strong>Pet ventage Team</strong></p>
//                 </div>
//               `

//             });


            return res.json({
                success: true,
                status: 201,
                message: "Enrolled succesfully",
                data: savedEnrollment,
            });
        }
        
        // Invalid step
        else{
            return res.json({
                success: false,
                status: 400,
                message: "Invalid request step",
            });
        }

    } catch (err) {
        console.error("Add enrollment error:", err);
        return res.json({
            success: false,
            status: 500,
            message: err.message || "Something went wrong",
        });
    }
};

add1 = (req, res) =>{
    
    let formData = req.body
    let validation = ""
    
 /*    if (!formData.image) {
        validation+="image is required "
    } */

    if (!formData.mentorshipId) {
        validation+="Mentorship Id is required "
    }

    if (!!validation.trim()) {
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }
    
    else{
    enrollmentModel.findOne({userId:req.decoded.userId , mentorshipId:formData.mentorshipId})
    
    .then( async (enrollmentData)=>{
    
        if (!enrollmentData) {
            
            let enrollmentObj = new enrollmentModel()
            let total = await enrollmentModel.countDocuments().exec()
            
            enrollmentObj.autoId = total+1
            enrollmentObj.userId = req.decoded.userId
            enrollmentObj.mentorshipId = formData.mentorshipId

            enrollmentObj.save()
        
            .then((enrollmentData)=>{
                res.json({
                   status:200,
                   success:true,
                   message:"Student Enrolled ",
                   data:enrollmentData
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
                message:"Same user is enrolled in same program already ",
                data:enrollmentData
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

// Fetching Enrollment
all = (req,res)=>{

    let formData = req.body
    let limit = formData.limit
    let currentPage = formData.currentPage
    delete formData.limit
    delete formData.currentPage
    
    enrollmentModel.find(formData)
    .populate({path:"mentorshipId" ,
        populate: [
            {
                path: "mentor",
                select: "name email" 
            },
            {
                path: "topics",
                select: "topic description" 
            }
        ]
    })
    .populate({path:"userId" , select:"name email"})
    .limit(limit)
    .skip((currentPage-1)*limit)
    
    .then(async(enrollmentData)=>{
        if(enrollmentData.length>0){
            let total=await enrollmentModel.countDocuments(formData).exec()
            res.json({
                status:200,
                success:true,
                message:"enrollment loaded",
                total:total,
                data:enrollmentData
            })
        }

        else{
            res.json({
                status:404,
                success:false,
                message:"No enrollment Found!!",
                data:enrollmentData
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


// to fetch single enrollment detail
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
       enrollmentModel.findOne({_id:formData._id})
      .populate({path:"userId" , select:"name email"})
      .populate({path:"mentorshipId" , select:"mentor topics",
        populate: [
            {
                path: "mentor",
                select: "name email" 
            },
            {
                path: "topics",
                select: "topic description" 
            }
        ]
      })

       .then((enrollmentData)=>{
          if (!enrollmentData) {
            res.json({
                status:404,
                success:false,
                message:"No enrollment Found !"
            })
          }
          else{
            res.json({
                status:200,
                success:true,
                message:"enrollment Found !",
                data:enrollmentData
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


// updating enrollment
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
    
        enrollmentModel.findOne({_id:formData._id})
        .then(async(enrollmentData)=>{
            if(!enrollmentData){
                res.json({
                    status:404,
                    success:false,
                    message:"No enrollment found!!"
                })
            }
            else{
                
             enrollmentData.save() 

               .then((enrollmentData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"enrollment updated successfully!!",
                        data:enrollmentData
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
    
    if(!formData.status){
        validation+="status is required"
    }
    
    if(!!validation.trim()){
        res.json({
            status:422,
            success:false,
            message:validation
        })
    }else{
        enrollmentModel.findOne({_id:formData._id})
        .then((enrollmentData)=>{
            if(!enrollmentData){
                res.json({
                    status:404,
                    success:false,
                    message:"No enrollment found!!"
                })
            }else{
           
               enrollmentData.status=formData.status 
               enrollmentData.save()
               .then((enrollmentData)=>{
                    res.json({
                        status:200,
                        success:true,
                        message:"Status updated successfully",
                        data:enrollmentData
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


module.exports = {add , add1, all , single , update , changeStatus}