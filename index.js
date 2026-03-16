const express=require("express")
const app=express()
require("dotenv").config()
const PORT=process.env.PORT
const connectdb=require("./config/connectdb")
const productRoutes=require("./routes/productRoutes")
const userRoutes=require("./routes/userRoutes")
const cors = require("cors");

connectdb()

const corsOptions = {
    origin: '*', 
    credentials: true, 
  };
app.use(cors(corsOptions));

const path = require('path');
app.use('/uploads',express.static(path.join(__dirname, 'uploads'))); 

app.use(express.json())


app.use("/product",productRoutes)
app.use("/user",userRoutes)

app.use((req,res)=>{
    return res.status(404).send("NOT FOUND")
})



app.listen(PORT,()=>console.log("server is running"))