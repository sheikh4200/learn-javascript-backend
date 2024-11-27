//we try both methods 
//(1)Promises
//using arrow function
const asyncHandler = (requestHandler)=>{
Promises.resolve(requestHandler(req,res,next)).catch((err)=> next(err))
}












export {asyncHandler}

//(2)try-catch
//we use arrow function in this method

// const asyncHandler = (fn) => async(req,res,next)=>{
//     try{
// await fn(req,res,next)
//     }
//     catch(error){
//         res.status(err.code || 500).json({
//             message:err.message,
//             success:false

//         })
//     }

// }
// export {asyncHandler}