const bcrypt = require("bcrypt");

class Hash {
    async hash(password){
        try {
            return await bcrypt.hash(password, 10);
        } catch (error) {
            return error;
        }
    }
}

module.exports = Hash;

// module.exports = {
//     async compare(rawPassword, ){
//         try {
//             return await bcrypt.compare(rawPassword, encryptedPassword)
//         } catch (error) {
//             return error
//         }
//     }
// }