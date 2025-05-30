const express = require("express");
const cors = require('cors');
const app = express();
require('dotenv').config()

app.use(express.json({limit:"40mb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("./server/public/"))
app.use(cors());

const api = require('./server/routes/apiRoutes');
app.use("/api", api)
const admin = require('./server/routes/AdminRoutes')
app.use("/admin",admin)
const mentor = require('./server/routes/MentorRoutes')
app.use("/mentor", mentor)
const student = require('./server/routes/StudentRoutes')
app.use("/student", student)

const database = require("./server/config/database")
const seed = require("./server/config/seed")

app.listen(process.env.PORT,()=>{
    console.log("Server is running at", process.env.PORT);   
})

app.get("/",(req,res)=>{
      res.json({
        status:200,
        success:true,
        message:"Server is running"
    })
})

app.all("/**",(req,res)=>{
    res.status(404).json(
      {
        status:404,
        success:false,
        message:"Error !"
      }
    )
  })