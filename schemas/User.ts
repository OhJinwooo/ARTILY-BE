import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userId: String,
    nickname: String,
    role: Boolean,
    refreshToken: String

});

module.exports = mongoose.model("User", UserSchema);