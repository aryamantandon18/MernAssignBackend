import { app } from "./app.js";
import { connectDB } from "./data/database.js";
import cloudinary from 'cloudinary'
connectDB();

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,

})

const port = process.env.PORT
app.listen(port,()=>{
    console.log(`Server is working on http://localhost:${port} in ${process.env.node_env} mode`);
})