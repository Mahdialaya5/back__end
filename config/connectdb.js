const mongoose=require("mongoose")

const connectdb=async()=>{
try {
    await mongoose.connect(process.env.uri)
    console.log("db connect");
} catch (error) {
    console.log(error);
}
}
module.exports=connectdb