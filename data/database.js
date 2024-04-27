import mongoose from "mongoose";

export const connectDB = ()=>{
    mongoose.connect(process.env.MONGO_URI).then((c)=> console.log(`Database connected with ${c.connection.host}`))
    .catch((e)=> console.error(`Error while connecting Databse : ${e}`));
}
