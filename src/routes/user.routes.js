import { Router } from "express";
import {changeAvatar,
        changeCoverImage,
        changeCurrentPassword,
        getCurrentUser,
        getUserChannelProfile,
        getUserHistory,
        loginUser,
        logOutUser,
        refreshAccessToken,
        registerUser,
        updateAccountDetails,
        userDeleteController
             } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },{
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

    router.route("/login").post(loginUser)

    //secured route
router.route("/logOut").post(verifyJWT, logOutUser)

router.route('/refresh-token').post(refreshAccessToken)

router.route("/change-password").post(verifyJWT,changeCurrentPassword)

router.route("/currentUser").get(getCurrentUser)//get current user  details and important information if does not work then used jwtVerify 
router.route("/account-update").patch(verifyJWT,updateAccountDetails)

router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),changeAvatar)

router.route("/coverImage").patch(verifyJWT,upload.single("coverImage"), changeCoverImage)

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)

router.route("/history").get(verifyJWT,getUserHistory)

router.route("/:id").delete(verifyJWT,userDeleteController)

export default router