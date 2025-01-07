import mongoose,{Schema} from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    Subscriber:{
        type: Schema.Types.ObjectId,// one who is subscribing        
        ref: 'User',
    },
    channel:{
        type: Schema.Types.ObjectId,// one to whom 'Subscriber' to subscribe
        ref: 'User',
    }
},{timestamps:true})

export const Subscription = mongoose.model('Subscription', subscriptionSchema);