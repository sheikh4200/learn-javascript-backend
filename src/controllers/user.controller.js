
import { apiError } from "../utils/apiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const generateAccessAndReFreshToken = async (userId)=>{
try {
  const user = await User.findById(userId)
  if(!user){
    throw new apiError(400,"user is not found")
  }
 const accessToken =  user.generateAccessToken()
 const refreshToken = user.generateRefreshToken()
 user.refreshToken = refreshToken
//how to save we used save() method 
// but the question is that used save() method it save all like username email, like 
// it will save password so, the solution is simple//
// let see
await user.save({
 validateBeforeSave: false
})
return{accessToken , refreshToken}

} catch (error) {
  throw new apiError(500,"ERROR failEd to generate Access and Refresh Token")  
}
}

const  registerUser = asyncHandler(async(req,res)=>
    {
        //get user details from frontend
        //see validation of user - not empty
        //check if user is already exist -> by username and email
        //check for images, check the avatar
        //upload them to cloudinary
        // create user object - create entry in db
        //removed password and refresh token from response
        //check user creation
        //return response
const {fullname,email,username,password} = req.body
// console.log("req.body",req.body)
console.log("email :", email)

if([ fullname,email,username,password].some((field)=>{
    field?.trim() === ""})){
throw new apiError(400,"All fields are required!");
}
const existingUser = await User.findOne({
    $or:[{ username },{ email }]
})
if(existingUser){
throw new apiError(409,"user is already exist");

}

const avatarLocalPath = req.files?.avatar[0]?.path;
// console.log(req.files)
//  const coverImageLocalPath = req.files?.coverImage[0]?.path;
   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path
   }
 
 if(!avatarLocalPath){
    throw new apiError(400,"avatar is required")
 }
 const avatar =await uploadOnCloudinary(avatarLocalPath)
 const coverImage = await uploadOnCloudinary(coverImageLocalPath)
 if(!avatar){
throw new apiError(400,"avatar is required")}

    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()

       
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
         throw new apiError(500,"something went wrong while creating user")
    }
res.status(201).json(
   new apiResponse(200,createdUser,"user has been create successfully")
)
})

const loginUser = asyncHandler(async(req,res)=>{
// Todos for User

// collect data from client-side by data => req.body
// for validation we make user to input username or email if any of these two exist we ask him for password
// check password 
// then we match accessToken and refreshToken with db tokens
// send cookies => which we learn here 

// let begin and do step-by-step

const {email,password} = req.body // first step

//if email isn't exist then we put a condition
if(!email){
    throw new apiError(400,"email is required")
}

const user =   await User.findOne({
$or:[{email}]//mongodb operators
})

if(!user){
throw new apiError(404,"user don't exist")
}//step-2
// console.log(user)

const isPasswordValid =  user.isPasswordCorrect(password)
if(!isPasswordValid){
throw new apiError(400,"the password is not correct")
}// step-3

  const {accessToken,refreshToken} = await  generateAccessAndReFreshToken(user._id)//step-4

// console.log({accessToken,refreshToken})

  // step-5 is depend on your needs if this a expensive operation to call again the database or you can call db again depend on situations
//  const loggedInUser =  User.findById(user._id).select("-password -refreshToken")
 //step-5
// now my case is simple so i don't need to call db again so i skip this step
 // now move to cookies
// cookies are like options so,

const options = {
  httpOnly: true,
  secure:true
}
res.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken",refreshToken, options)
.json(
 
    new apiResponse(200,
{user:loginUser,user,accessToken,refreshToken
},
  "User logged in successfully",
))
})


const logOutUser = asyncHandler(async(req,res)=>{
User.findByIdAndUpdate(
  req.user._id,
  {
    $set:{
      refreshToken: null//undefined
    }
  },{
    new:true

    
  },
)

const options = {
    httpOnly: true,
    secure:true
  }
  return res
  .status(200)
  .clearCookie('refreshToken', '', options)
.clearCookie("accessToken",'',options)
  .json(new apiResponse(200, {},"user successfully logOut"))

})

const refreshAccessToken = asyncHandler(async(req,res)=>{
  const incomingRefreshToken =req.cookies.refreshToken || req.body.refreshToken
 try {
   if(!incomingRefreshToken) {
     throw new apiError(400,"invalid authorization") 
     }
     //how we verify the token
     const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
     
     const refreshUser = await User.findById(decodedToken?._id)
     if(!refreshUser) {
       throw new apiError(400,"invalid refreshToken") 
       }
     
       if(incomingRefreshToken !== refreshUser?.refreshToken) {
     throw new apiError(401,"refresh Token is expired or used")
       }
     
       const options = {
         httpOnly: true,
         secure:true
       }
      const {accessToken,newRefreshToken} = await generateAccessAndReFreshToken(refreshUser._id)
     res.status(200)
     .cookie("accessToken",accessToken, options)
     .cookie("newRefreshToken",newRefreshToken, options)
     .json(new apiResponse(200, {accessToken,refreshToken:newRefreshToken},"refresh token successfully generated"))
 } catch (error) {
  throw new apiError(401, error.message || "invalid refreshToken")
 }
      
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new apiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new apiError(400, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"));
});

// const changeCurrentPassword = asyncHandler(async(req,res)=>{
//   const {oldPassword,newPassword} = req.body
        
//      const user =  await User.findById(req.user?._id)
//   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
//    if(!isPasswordCorrect) {
//     throw new apiError(400,"old password is incorrect")
//     }
//     user.password = newPassword
//     await user.save({ validateBeforeSave:false})

//     return res
//     .status(200)
//     .json(new apiResponse(200,{},{message:"password changed successfully"},"password changed successfully"))
// })

const getCurrentUser = asyncHandler((req,res)=>{
  return res
  .status(200)
  .json(new apiResponse(200,req.user,"currentUser found successfully"))
})

const updateAccountDetails = asyncHandler(async(req,res)=>
{
  const {fullname,email} = req.body
  if(!fullname || !email) {
    throw new apiError(400,"invalid request")
    }
   const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        fullname,
        email:email
      }
    },
    {new:true}
   ).select("-password")
   return res
   .status(200)
   .json(new apiResponse(200,user,"account details updated successfully"))
})

const changeAvatar = asyncHandler(async(req,res)=>{
 const avatarLocalPath =  req.file?.path
 if(!avatarLocalPath){
throw new apiError(400,"Avatar is missing")
 }
// then we upload on cloudinary
const avatarCloudinaryPath = await uploadAvatar(avatarLocalPath)
//if url des't found in response, throw an error
if(!avatarCloudinaryPath?.url){
  throw new apiError(400,"ERROR while uploading avatar on cloudinary")
  }
const user =  await User.findByIdAndUpdate(
  req.user?._id,
  {
    $set:{
      avatar:avatarCloudinaryPath?.url
    }
  },
  {new:true}
).select("-password")
return res
.status(200)
.json(new apiResponse(200,user,"avatar is successfully updated"))
})

const changeCoverImage = asyncHandler(async(req,res)=>{
  const coverImageLocalPath =  req.file?.path
  if(!coverImageLocalPath){
 throw new apiError(400,"cover Image is missing")
  }
 // then we upload on cloudinary
 const coverImageCloudinaryPath = await uploadAvatar(coverImageLocalPath)
 //if url des't found in response, throw an error
 if(!coverImageCloudinaryPath?.url){
   throw new apiError(400,"ERROR while uploading cover Image on cloudinary")
   }

  const user =  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
       coverImage :coverImageCloudinaryPath?.url
      }
    },
    {new:true}
  ).select("-password")
  return res
  .status(200)
  .json(new apiResponse(200,user,"cover Image is successfully updated"))
  })

  const getUserChannelProfile = asyncHandler(async(req,res)=>{
    const {username} = req.params
if(!username){
throw new apiError(400,"username is missing!")
}

const channel  = await User.aggregate([{
  $match:{
    username:username?.toLowerCase()
  }},

{
  $lookup:{
    from:"subscriptions",
    localField:"_id",
    foreignField:"channel",
    as:"subscribers"
  }},

    {
    $lookup:{
      from:"subscriptions",
      localField:"_id",
    foreignField:"  Subscriber",
    as:"subscribedTo"

    }},
    {
      $addFields:{
        subscribersCount:{
          $size:"$subscribers"
        },
        channelSubscribedToCount:{
          $size:"$subscribedTo"
        },
        isSubscribed:{
         $cond:{
          if:{
            $in:[req.user._id,"$subscribers.subscriber"]
          },
          then:true,
          else:false,
         }
        }
      }
    },
    {
      $project:{
        username:1,
        fullname:1,
        subscribersCount:1,
        channelSubscribedToCount:1,
        isSubscribed:1,
        avatar:1,
        coverImage:1,
        email:1
      }
    }
])
if(!channel?.length){
throw new apiError(401,"channel is not addressed")
}
return res
.status(200)
.json(new apiResponse(200,channel[0],
  "user channel fetched successfully"))

  })
//this is just a revision of the previous code
//   const getCurrentChannelProfile = asyncHandler(async(req,res)=>{
//         const {username} = req.params// so i know that it gets url if exist 
//         //if not it will be undefined
//         if(!username){
//             throw new apiError(401,"username is not addressed")
//         }
//         const channel = await User.aggregate([
//           {
//             $match:{
//               username:username?.toLowerCase()
//           }
//         },
//         {
//           $lookup:{
//             from:"subscriptions",
//             localField:"_id",
//             foreignField:"channel",
//             as:"subscribers"
//           }
//         },
//         {
//           $lookup:{
//             from:"subscriptions",
//             localField:"_id",
//             foreignField:" Subscriber",
//             as:"subscribedTo"
//           }
//         },{
//           $addFields:{
//             subscribersCount:{
//               $size:"$subscribers"
//             },
//             channelSubscribedToCount:{
//               $size:"$subscribedTo"
//             },
// isSubscribed:{
//               if:{
//                 $in:[req.user._id,"$subscribers.subscriber"]
//               },
//               then:true,
//               else:false
// },


//           },
//         $project:{
//           _id:1,
//           username:1,
//           subscribersCount:1,
//           channelSubscribedToCount:1,
//           isSubscribed:1,
//           fullname:1,
//           email:1,
//           avatar:1,
//           coverImage:1,   
//         }}
//         ])
// if(!channel?.length){
//   throw new apiError(404,"channel is not found")
// }

// return res
// .status(200)
// .json(new apiResponse(200,channel[0],"channel has fetched successfully"))
//   })
//code end here of revision

  //creating nested $loopUp pipelines

  const getUserHistory = asyncHandler(async(req,res)=>{
const user = await User.aggregate([
  {
    $match:{
    _id: new mongoose.Types.ObjectId([req.user._id])
    //if not work or some error occur then use mongoose.Schema.Types.ObjectId removed Schema from it
    }
  },{
    $lookup:{
      from:"videos",
      localField:"watchOverHistory",
      foreignField:"_id",
      as:"watchedVideos",
pipeline:[
  {
    $lookup:{
        from:"users",
        localField:"owner",
        foreignField:"_id",
        as:"owner",
        pipeline:[
          {
            $project:{
              username:1,
              fullname:1,
              avatar:1,
            } 
          },
          {
          $addFields:{
                      owner:{
                        // $arrayElemAt:["$owner",0]
                      $first:"$owner"
                      }
}
          }
        ]
    }
  }
]

    }
  }
])
return res
.status(200)
.json(
new apiResponse(200,user[0].history,"watchHistory successfully fetched")
)})
//let write revision of get user history to find user history

// const getUserHistory2 = asyncHandler(async(req,res)=>{
// //writing aggregate pipeline to get user history
// let user = await User.aggregate([
// {
//   $match:{
//     _id:new mongoose.Schema.Types.ObjectId(req.user?._id)
//   }
// },
// {
//   $lookup:{
//     // from:"Video"// in code we write collection name or Schema
//     from:"videos",
//     localField:"_id",
//     foreignField:"watchOverHistory",
//     as:"watchHistory",
//     //nested aggregate pipelines
//     //we are using $pipeline//
//     pipeline:[
//       {
//           $lookup:{
//                   from:"users",
//                   localField:"owner",
//                   foreignField:"_id",
//                   as:"owner",
//                   //nested aggregate pipelines
//                   //we are using $pipeline//
//                   $pipeline:[
//                     {
//                       $project:{
//                     username:1,
//                     avatar:1,
//                     fullname:1,                        
//                       } }
//                   ] } }] }
// },
// {
//   $addFields:{
//     owner:{
//       // $arrayElemAt:["$owner",0]
//       $first:"$owner"
//     }
//   }
// }
// ])
// //console.log(user)
// return res
// .status(200)
// .json(new apiResponse(200,user[0],"user History fetched successfully!"))
// })
//this revision over here is to get the user history of the user who is logged in

// to delete a user in the webApp we create a user delete controller
const userDeleteController = asyncHandler(async(req,res)=>{
const user = await User.findByIdAndDelete(req.params)

if(!user){
  throw new apiError("User not found")
}
return res
.status(200)
.json(new apiResponse(200,user,"User deleted successfully!"))
})
//after finish the ork let see if we can fix this bug or not

export {registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
   getCurrentUser,
   updateAccountDetails,
   changeAvatar,
   changeCoverImage,
getUserChannelProfile,
getUserHistory,
userDeleteController 
  }