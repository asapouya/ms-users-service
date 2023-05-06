const post_user_valid = require("./validation/post_user");
const tryCatch = require("../util/try_catch");
const RabbitMQ = require("../broker/rabbitMq");
const Users = require("../models/users.model");
const mongoose = require("mongoose");
const _ = require("lodash");
const config = require("config");
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

    delete_user: tryCatch(async (req, res) => {
        const userHeader = JSON.parse(req.header("x-user"));            
        const userId = userHeader._id;
        
        const user = await Users.findOneAndDelete({ _id: userId });

        if(!user) return res.status(404).send("User doesn't exist.");

        const exchangeType = "fanout";
        const exchangeName = "user.delete.fanout";
        const booksQueueName = "books.user.delete.queue";
        const ordersQueueName = "orders.user.delete.queue";

        const rabbitMQ = new RabbitMQ(config.get("rabbitMQ_url"));
        await rabbitMQ.connect();
        await rabbitMQ.createChannel();
        rabbitMQ.errorEvent(err => console.log(err));
        await rabbitMQ.createExchange(exchangeType ,exchangeName, { durable: true });
        await rabbitMQ.createQueue(booksQueueName, { durable: true });
        await rabbitMQ.createQueue(ordersQueueName, { durable: true });
        await rabbitMQ.bindQueueToExchange(booksQueueName, exchangeName, "");
        await rabbitMQ.bindQueueToExchange(ordersQueueName, exchangeName, "");
        rabbitMQ.publishMessage(exchangeName, JSON.stringify({

            eventName: "user.delete",
            data: {
                userId: user._id,
                reason: "user-deleted",
                timestamp: Date.now()
            }
        
        }), "");
        rabbitMQ.publishMessage(exchangeName, JSON.stringify({
            userId: user._id,
            reason: "user-deleted",
            timestamp: Date.now()
        }), ""); 

        res.send(user);
    })
}