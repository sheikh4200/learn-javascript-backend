const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      next(err); // Pass the error to the next middleware
    });
  };
};

export { asyncHandler };















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