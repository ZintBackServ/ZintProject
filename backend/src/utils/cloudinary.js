const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
      secure: true, // always return HTTPS URLs
    });

    // Prefer secure_url (HTTPS); fall back to url only as a last resort
    const secureUrl = response.secure_url || response.url;
    console.log("file is uploaded on cloudinary", secureUrl);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    // Expose secure_url as .url so all existing controller code gets HTTPS automatically
    return { ...response, url: secureUrl };
  } catch (error) {
    console.log("Cloudinary Error:", error?.message || error);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

module.exports = { uploadOnCloudinary };

// const cloudinary = require("cloudinary").v2;

// const fs = require("fs");

//  // Configuration
//      cloudinary.config({ 
//          cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//          api_key: process.env.CLOUDINARY_API_KEY, 
//          api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
//      });


// const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     if (!localFilePath) return null;

//     const response = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//     });

//     console.log("file is uploaded on cloudinary", response.url);

//     if (fs.existsSync(localFilePath)) {
//       fs.unlinkSync(localFilePath);
//     }

//     return response;
//   } catch (error) {
//     console.log("Cloudinary Error:", error?.message || error);

//     if (fs.existsSync(localFilePath)) {
//       fs.unlinkSync(localFilePath);
//     }

//     return null;
//   }
// };

// module.exports = { uploadOnCloudinary };


// const cloudinary = require("cloudinary").v2;

// const fs = require("fs");

// // Configuration
//     cloudinary.config({ 
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//         api_key: process.env.CLOUDINARY_API_KEY, 
//         api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
//     });
// const uploadOnCloudinary = async(localFilePath) => {
//   try{
//     if(!localFilePath) return null
//     //upload the file on cloudinary
//     const response = await cloudinary.uploader.upload(localFilePath,{
//         resource_type:"auto"
//     })

//     //file has been uploaded successfull
    
//     console.log("file is uploaded on cloudinary", response.url);

//     // ✅ delete local temp file after successful upload
//         fs.unlinkSync(localFilePath);
//     return response;

//   }catch(error){
//      console.log("Cloudinary Error:", error.message);
//     fs.unlinkSync(localFilePath)  //remove the locally saved temporary file as the upload operation got failed
//     return null;
//   }
// }

// module.exports =  {uploadOnCloudinary}



