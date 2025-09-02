import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        firstname: {
            type: String, 
            required: true
            },
        lastname: { 
            type: String, 
            required: true 
        },
        email: {
            type: String,
            required: true, 
            unique: true 
            },
        password: {
            type: String, 
            required: true
            },
        isVerified: {
            type: Boolean,
            default: false
        },
        verificationToken: {
            type: String
        },
        verificationTokenExpiry: {
            type: Date
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpiry: {
            type: Date
        }
}, {
    timestamps: true
});

export const createUser = mongoose.model("ChatApp", userSchema);