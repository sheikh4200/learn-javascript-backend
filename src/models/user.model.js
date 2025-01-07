import mongoose,{Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    avatar:{
        type:String,//we use cloudinary url
        required:true
    },
coverImage:{
    type:String,//we use cloudinary url

},
watchOverHistory:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }
],
password:{
    type:String,
    required:[true,"password is required"]
},
refreshToken:{
type:String,
}

},{timestamps:true})




userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) //if any error shows removed ! sign 
         {
        // console.log("Hashing password before saving:", this.password); // Plain text password
        this.password = await bcrypt.hash(this.password, 10);
        // console.log("Hashed password:", this.password); // Hashed password
    }
    next();

});

// // Custom method to compare passwords
userSchema.methods.isPasswordCorrect = async function (password) {
    // Compare the provided password with the hashed password
    return await bcrypt.compare(password, this.password);
};

// console.log("Password received from client:");

// 

//using custom methods to generate access and refresh tokens
userSchema.methods.generateAccessToken = function(){
   return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY 
    }
)
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,
        // email:this.email,
        // username:this.username,
        // fullname:this.fullname
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}


export const User = mongoose.model("User",userSchema)

