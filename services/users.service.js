class UsersService {

    constructor({MongoRepo, BrokerRepo, Hash, lodash}) {
        this.mongo = MongoRepo;
        this.rabbitMQ = BrokerRepo;
        this.hash = Hash;
        this._ = lodash;
    }

    get_user_by_Id = async (req, res) => {
        const userId = req.params.userId;
        const user = await this.mongo.findById(userId, {password: 0, booksPurchased: 0, __v: 0});
        res.send(user);
    }

    get_user = async (req, res) => {
        if(!req.query.email) return res.send("");
        const user = await this.mongo.findOne(req.query);
        console.log(user);
        res.send(user);
    }

    post_user = async (req, res) => {
        const user = this.mongo.userFactory(this._.pick(req.body, ["username", "email", "password"]));
        user.password = await this.hash.hash(user.password);
        await user.save();
        res.status(201).send(this._.pick(req.body, ["username", "email"]));
    }
    
    delete_user = async (req, res) => {
        const userHeader = JSON.parse(req.header("x-user"));            
        const userId = userHeader._id;
        
        const user = await this.mongo.findOneAndDelete({ _id: userId });
        if(!user) return res.status(404).send("User doesn't exist.");

        const exchangeType = "fanout";
        const exchangeName = "user.delete.fanout";
        const booksQueueName = "books.user.delete.queue";
        const ordersQueueName = "orders.user.delete.queue";
        const maxReQueueRetries = 10;

        await this.rabbitMQ.createChannel();
        this.rabbitMQ.errorEvent(err => console.log(err));
        await this.rabbitMQ.createExchange(exchangeType ,exchangeName, { durable: true });
        await this.rabbitMQ.createQueue(booksQueueName, { durable: true, arguments: {"x-max-length": maxReQueueRetries + 1} });
        await this.rabbitMQ.createQueue(ordersQueueName, { durable: true, arguments: {"x-max-length": maxReQueueRetries + 1 } });
        await this.rabbitMQ.bindQueueToExchange(booksQueueName, exchangeName, "");
        await this.rabbitMQ.bindQueueToExchange(ordersQueueName, exchangeName, "");
        this.rabbitMQ.publishMessage(exchangeName, JSON.stringify({

            eventName: "user.delete",
            data: {
                userId: user._id,
                reason: "user-deleted",
                timestamp: Date.now()
            }
        }), "");
        res.send(user);
    }

    handle_order_finalization = async () => {
        //listen to queue for message
        try {
            await this.rabbitMQ.createChannel();
            this.rabbitMQ.errorEvent(err => {
                console.log(err);
            })
            await this.rabbitMQ.listenForMessage("users.finalize.order.queue", async (msg) => {
                //parse message
                const content = JSON.parse(msg.content.toString());
                const booksToBeAdded = content.data.books;
                const userId = content.data.userId;
                //add books to user obj in db 
                try {
                    const user = await this.mongo.updateOne({_id: userId}, {
                        $push: {booksPurchased: booksToBeAdded}
                    });
                    console.log(user);                   
                    this.rabbitMQ.ack(msg);
                } catch (err) {
                    console.log(err);
                    this.rabbitMQ.noAck(msg);
                }
            })
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = UsersService;