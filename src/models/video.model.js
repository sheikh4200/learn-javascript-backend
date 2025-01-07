import mongoose,{Schema} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
const videoSchema = new Schema({
    videoFile:{
type:String,// we use cloudinary url
required:true
    },
    thumbnail:{
        type:String,// we use cloudinary url
        required:true
    },
    title:{
        type:String,
        required:true
    },
           description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,// we use cloudinary url
        required:true,
    },
    view:{
        type:String,
        default:0
    },
    isPublish:{
        type:Boolean,
        default:true,
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    } 
},{timestamps:true})
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video",videoSchema)