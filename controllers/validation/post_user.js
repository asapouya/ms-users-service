const joi = require("joi");
const password_complexity = require("joi-password-complexity");

module.exports = async function(obj){
    const schema = joi.object({
        username: joi.string()
            .required()
            .min(2)
            .max(128),
        email: joi.string()
            .email()
            .required(),
        password: password_complexity().required()
    })

    return await schema.validateAsync(obj);
}