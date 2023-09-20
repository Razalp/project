const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    is_admin:{
        type:Boolean,
        default:false
    }
})
module.exports=mongoose.model("User",userSchema)