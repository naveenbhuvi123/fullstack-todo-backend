import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'


const userSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    }
})

// Middleware to hash password before saving


const User = mongoose.model("User", userSchema);
export default User;
