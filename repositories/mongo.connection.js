class MongoConnection {
    
    constructor({Config}) {
        const instance = this.constructor.instance;
        if(instance) return instance;
        this.config = Config;
        this.constructor.instance = this;
    }

    async connect() {
        if(MongoConnection.connection){
            return MongoConnection.connection;
        }
        MongoConnection.connection = await require("mongoose").connect(this.config.get("mongo_url"));
        console.log('\x1b[33m%s\x1b[0m', "Connected to orders DB.");
    }

    get getConnection() {
        return MongoConnection.connection
    }
}

module.exports = MongoConnection;