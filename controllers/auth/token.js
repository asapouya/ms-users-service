const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = {
    generate_admin_token(id){
        return jwt.sign({_id: id, admin: true}, 
        config.get("JWT_PRIVATE_KEY"),
        {expiresIn: "7d"});
    },
    generate_token(id){
        return jwt.sign({_id: id},
        config.get("JWT_PRIVATE_KEY"), 
        {expiresIn: "7d"});
    },
    verify_token(token){
        return jwt.verify(token, config.get("JWT_PRIVATE_KEY"));
    }
}