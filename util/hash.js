const bcrypt = require("bcrypt");

module.exports = {
    async hash(password){
        try {
            return await bcrypt.hash(password, 10);
        } catch (error) {
            return error;
        }
    },
    async compare(rawPassword, ){
        try {
            return await bcrypt.compare(rawPassword, encryptedPassword)
        } catch (error) {
            return error
        }
    }
}