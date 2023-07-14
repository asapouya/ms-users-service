const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 2,
        max: 128
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 1024
    },
    admin: {
        type: Boolean
    }, 
    booksPurchased: {
        type: [String]   
    }
})

const Users = model("users", userSchema);

module.exports = Users;