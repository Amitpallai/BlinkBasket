import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, 
    cartItems: { type: Object, default: {} },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
}, { minimize: false, timestamps: true });

const userModel = mongoose.model("user", userSchema);

export default userModel;
