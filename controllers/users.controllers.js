const post_user_valid = require("./validation/post_user");
const tryCatch = require("../util/try_catch");
const Users = require("../models/users.model");
const _ = require("lodash");
const { hash } = require("../util/hash");

module.exports = {
    async get_user_by_Id(req, res){  
        const userId = req.params.userId;
        const user = await Users.findById(userId, {password: 0, booksPurchased: 0, __v: 0});
        res.send(user);
    },

    get_user: tryCatch(async (req, res) => {
        if(!req.query.email) return res.send("");
        const user = await Users.findOne(req.query);
        console.log(user);
        res.send(user);
    }),

    post_user: tryCatch(async (req, res) => {
        await post_user_valid(req.body);
        const user = new Users(_.pick(req.body, ["username", "email", "password"]));
        user.password = await hash(user.password);
        await user.save();
        res.status(201).send(_.pick(req.body, ["username", "email"]));
    }),
    update_user(req, res){
        //validate body
        //only can modify username
    },
    delete_user(req, res){
        //ask password
        // publish message to orders service to delete all orders with user 
    }
}