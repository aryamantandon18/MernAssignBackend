import mongoose, { mongo } from "mongoose";
import validator from 'validator'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,"Please enter your name"],
        maxLength:[40,"Name cannot exceed 40 characters"]
    },
    email:{
        type:String,
        unique:true,
        required:true,
        validate:[validator.isEmail,"Please enter a valid email"]
    },
    password:{
        type: String, 
        select: false,
        minLength:[8,"password should be greater than 8 characters"] ,
        required: true,
    },
    images:[
        {
            title:{
                type:String,
                required:true,
            },
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default: Date.now,
    }
})

export const User = mongoose.model("user",userSchema);