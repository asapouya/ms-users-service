const {createContainer, asClass, InjectionMode, asValue} = require("awilix");
const BrokerRepo = require("./repositories/rabbittmq.repo");
const UsersService = require("./services/users.service");
const UsersController = require("./controllers/users.controllers");
const RabbitMQConnection = require("./repositories/rabbitmq.connection");
const MongoConnection = require("./repositories/mongo.connection");
const MongoRepo = require("./repositories/mongo.repo.js");
const Users = require("./models/users.model");
const Hash = require("./util/hash");
const _ = require("lodash");
const Config = require("./util/config");

const container = createContainer({
    injectionMode: InjectionMode.PROXY
});

async function diSetup() {

    const rabbitMQConnection = new RabbitMQConnection(new Config());
    const mongoConnection = new MongoConnection(new Config());
    await mongoConnection.connect();
    await rabbitMQConnection.connect();

    container.register({
        lodash: asValue(_),
        usersModel: asValue(Users),
        rabbitMQConnection: asValue(rabbitMQConnection.getConnection),
        Config: asClass(Config),
        Hash: asClass(Hash),
        UsersService: asClass(UsersService),
        UsersController: asClass(UsersController).scoped(),
        MongoRepo: asClass(MongoRepo),
        BrokerRepo: asClass(BrokerRepo),
    })
}

module.exports = {container, diSetup};   