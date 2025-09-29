import app from "./app.js";
import DbConnection from "./config/DbConnection.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

//cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_Secret: process.env.CLOUDINARY_API_SECRET
});

app.listen(async() => {
    await DbConnection();
    console.log(`Server is running on port ${PORT}`);
})

