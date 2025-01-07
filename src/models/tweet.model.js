import { Schema } from "mongoose";
import mongoose from "mongoose"

const tweetSchema = new Schema({ 
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "Like"
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
}, { timestamps: true })

export const Tweet = mongoose.model("Tweet", tweetSchema)