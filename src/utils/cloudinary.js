import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;
    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: 'auto',
    });
    // file has been upladed successfully
    //console.log('File uploaded to Cloudinary successfully', response.url);
    fs.unlinkSync(filePath); // Delete the local file after successful upload
    return response;
  } catch (error) {
    fs.unlinkSync(filePath); // Delete the local file in case of an error
    return null;
  }
};

export { uploadOnCloudinary };