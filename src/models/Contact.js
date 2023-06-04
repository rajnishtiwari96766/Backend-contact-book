import mongoose from "mongoose";

const contactSchema = mongoose.Schema(
    {
        id: {
            type:String
        },
        userId: {
            type:String,
            required:[true,"Please enter your userId"]
        },

        name:{
            type:String,
            required:[true,"Please enter your name"]
        },
        phone:{
            type:String,
            required:[true,"Please enter your phone number"]
        }
    },{
        timestamps:true
    }
)

const Contact = mongoose.model('Contact',contactSchema);
export default Contact;