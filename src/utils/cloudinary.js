import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises"




    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET  // Click 'View API Keys' above to copy your API secret
    });

    const uploadOnCloudinary = async (localFilePath)=>{
        try{
            if(!localFilePath) return null
            //upload the file on cloudinary
          const response =  await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            }) 
            //file has been successfully uploaded
            // console.log("file is uploaded successfully",
            //     response.url)
            fs.unlinkSync
            // if we want to delete the file from local machine when we used fs.unlinkSync() then is says that it is not a function so, we used fs.unlinkSync instead of fs.unlinkSync() and it works fine in my case/*
                return response;
            }

catch(error){

    fs.unlinkSync(localFilePath)//remove the locally saved file as the file upload got filed 
return null;
}}
    
export {uploadOnCloudinary}


    
// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs/promises"; // Use fs/promises for better async handling

// // Cloudinary Configuration
// if (
//   !process.env.CLOUDINARY_CLOUD_NAME ||
//   !process.env.CLOUDINARY_API_KEY ||
//   !process.env.CLOUDINARY_API_SECRET
// ) {
//   throw new Error("Cloudinary environment variables are not set!");
// }

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) {
//       throw new Error("No file path provided");
//     }

//     // Upload the file to Cloudinary
//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });

//     // 
//     fs.unlinkSync("localFilePath")
//     return response;
//   } catch (error) {
//     console.error("File upload failed:", error.message);

//     // Attempt to delete the local file if it exists
//     try {
//       await fs.unlink(localFilePath);
//       console.log("Local file deleted after failed upload");
//     } catch (unlinkError) {
//       console.error("Failed to delete local file:", unlinkError.message);
//     }

//     return null; // Return null on error
//   }
// };

// export { uploadOnCloudinary };

