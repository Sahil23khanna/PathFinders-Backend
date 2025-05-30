const userModel = require('../apis/user/userModel')
const bcryptjs = require("bcryptjs")

userModel.findOne({email:"admin@gmail.com"})
.then((userData)=>{
    if (!userData) {
        let userObj = new userModel()
        userObj.autoId=1 
        userObj.name="admin"
        userObj.email="admin@gmail.com"
        userObj.password=bcryptjs.hashSync("111",10)
        userObj.userType=1 
        userObj.save()
        .then((userData)=>{
            console.log("Admin Seeded Successfully");
            
        })
        .catch((err)=>{
            console.log("Error while seeding Admin",err);
            
        })
    }
    else{
        console.log("Admin already exists");
        
    }
})

.catch((err)=>{
    console.log("Error while seeding Admin",err);
    
})