import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true,
    },

    firstname: {
        type: String,
        required: true
    },
    
    lastname: {
        type: String,
        required: true
    },

    nic: {
        type: String,
        required: true,
    },

    profilePic: {
        type: String,
        required: true,
        default: "https://i.ibb.co/NdrFXCJK/Pngtree-man-avatar-image-for-profile-13001882.png"
    },

    address : {
        type: String,
        required: true,
    },

    contact: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        required: true,
        default: "customer"
    },
})


const User = mongoose.model("user",userSchema);

export default User;

