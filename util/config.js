const config = require("config");

class Config {
    
    get(name){
        return config.get(name);
    }
}

module.exports = Config;