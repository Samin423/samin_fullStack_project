import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// User Registration Controller
const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    console.log("req.body:", req.body);
    const {fullName, email, username, password} = req.body;
    console.log("email:", email);
    // validate user details
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required"); 
    }
    
    // check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    // if user exists, throw error
    if (existedUser) {
        throw new ApiError(409, "User already exists with this email or username");
    }

    // handle file uploads
    console.log("req.files:", req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    console.log("avatarLocalPath:", avatarLocalPath);

    // validate avatar presence
    if (!avatarLocalPath){
        throw new ApiError (400, "Avatar is required");
    }

    // upload files to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!avatar) {
        throw new ApiError(400, "Error uploading avatar image");
    }

    // create user object in db
    const user = await User.create({
        fullname: fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        username : username.toLowerCase(),
        password
    });

    // remove password from response
    const createdUser = await User.findById(user._id).select("-password -refreshTokens");
    if (!createdUser) {
        throw new ApiError(400, "Error creating user");
    }

    // return response
    res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
    

    
    //check if user already exists
    //check for images, avatar
    //upload them to cloudinary
    //create user object in db
    //remove password from response
    //check for user creation
    //return response
});

export { registerUser };