import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,      // to remove whitespace
            index : true,   // for faster search
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index : true,
        },
        avatar: {
            type: String,     // URL of the avatar image (cloudinary URL)
            required: true,
        },
        coverImage: {
            type: String,    // URL of the cover image (cloudinary URL)
        },
        watchHistory: [ {
            type: Schema.Types.ObjectId,
            ref: "Video",
        }
    
        ],
    
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        },
    
    },

    { timestamps: true }


);


userSchema.pre("save", async function () {      // pre-save hook to hash password
    if (!this.isModified("password")) return; // if password is not modified, skip hashing
    this.password = await bcrypt.hash(this.password, 10);  // hash the password with salt rounds = 10
});

userSchema.methods.isPasswordCorrect = async function (password){
    return bcrypt.compare(password, this.password);
} 



//JWT is a bearer token. Like a key to access protected resources.

// generate access token
userSchema.methods.generateAccessToken = function (){
    return jwt.sign(  // payload, secret, options
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }  // token valid for 1 day
    )  
}


// generate refresh token
userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(  // payload, secret, options
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }  // token valid for 10 days
    )
}




export const User = mongoose.model("User", userSchema);

