import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import cloudinary from 'cloudinary'

export const SignUp = async(req, res,next) => {
  try {
    // console.log("Line 8 - ",req.body);
    const { name, email, password } = req.body;

    console.log("Received request body:", req.body);
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide both email and password" });
  }
  // console.log("line 13")
 
    let user = await User.findOne({email});
    // console.log(user)
    // console.log("line 15")
    if (user) {
      return res.status(404).json({
        success: false,
        message: "User already exist",
      });
    }
    console.log("line 22")
    const hashedPswd = await bcrypt.hash(password, 10);
    console.log(hashedPswd);
    user = await User.create({ name, email, password: hashedPswd ,images:[]});

    req.session.user = {
      id:user._id,
      name:user.name,
      email:user.email,
     };

    return res.status(200).json({
      success:true,
      message:"Register successfully",
      user
    })
  } catch (error) {
    return next(new ErrorHandler("Please Enter Email & Password",400));
  }
};

export const Login = async(req,res,next)=>{
  try {
   const {email,password} = req.body;
   if (!email || !password) {
     return next(new ErrorHandler("Please Enter Email & Password",400));
   }
   let user = await User.findOne({email}).select("+password");
 
   if(!user){
     return res.status(404).json({
       success:false,
       message: "User does not exist ",
     })
   }
   const isMatch= await bcrypt.compare(password,user.password);
   if(!isMatch){
     return res.status(404).json({
     success:false,
     message: "invalid password or email"})
   };
   req.session.user = {
    id:user._id,
    name:user.name,
    email:user.email,
   };
   
   res.status(200).json({
    success:true,
    message:"Login Successfully",
    user:req.session.user,
   })

  } catch (error) {
    console.error("Error in login"+error);  
   return next(new ErrorHandler(error.message, 500));
  }
 };

 export const Logout = (req,res,next) =>{
try{
  req.session.destroy((error)=>{
    if(error){
      console.error("Session Error is "+ error);
      return next(new ErrorHandler(error.message,500));
    }
    return res.status(200).json({
      success:true,
      message:"Logout Successfully",
    })
  })
}catch(e){
  console.log("line 81" + e);
  return next(new ErrorHandler(error.message,500));
}
}

export const getMyProfile = (req, res, next) => {
  try {
      const user = req.session?.user;
      if (!user) {
          throw new ErrorHandler("Login First", 404);
      }
      
      res.status(200).json({
          success: true,
          message: "Here is the user",
          user: user
      });
  } catch (error) {
      next(error); // Pass the error to the error handling middleware
  }
};

export const uploadImage = async (req, res) => {
  try {
    const userId = req.session?.user?.id; // Assuming user ID is available in request
    let user = await User.findOne({_id:userId});
    // console.log("Line 117");
    if(!user){
      return next(new ErrorHandler("User not found" , 404));
    }
    // console.log("Line 121");
    const result = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: "userImages",
      width: 150,
      crop: "scale"
    });
    // console.log(result);
    // console.log("Line 127");
    const newImage = {
      title:req.body.title,
      public_id: result.public_id,  
      url: result.secure_url
    };
   
    user.images.push(newImage);
    user.save();
     res.status(201).json({
      success:true,
      message:"Image Uploaded Successfully"
    })

  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
};

export const getImages =async(req,res,next)=>{
  let user = await User.findOne({_id:req.session.user.id});
  if(!user){
    return next(new ErrorHandler("User not found" , 404));
  }
  res.status(200).json({
    success:true,
    images:user.images
  })
}


// export const handler = async(req,res) =>{
//    let id = req.params.id;
// }

  
// readableSource.pipe(writableSource)




