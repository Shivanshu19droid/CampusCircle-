import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", false);

const DbConnection = async() => {
    try{
      const {connection} = await mongoose.connect(process.env.MONGO_URI);

      if(connection){
         console.log(`Connected to mongoDB ${connection.host}`);
      }
    }
    catch(error){
        console.log("Failed to connnect to database", error);
    }
}

export default DbConnection;