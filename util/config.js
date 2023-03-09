const config = require("config");

module.exports = {
    getConfig(name){
        return config.get(name);
    }
}