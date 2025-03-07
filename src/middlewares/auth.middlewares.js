import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler((req,res,next)=>{
try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
    // if des not find
    //we used if() method
    if(!token){
        throw new apiError(401,"unAuthorized request")
    }
    
    const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
    const user = User.findById(decodedToken?._id).select("-password -refreshToken")
    
    if(!user){
        throw new apiError(401,"Invalid Token")
    }
    req.user = user
    next()
} catch (error) {
    throw new apiError(401,error,"invalid")
}
})