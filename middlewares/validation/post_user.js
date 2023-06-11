const joi = require("joi");
const password_complexity = require("joi-password-complexity");

module.exports = async function(req, res, next) {
    try {
        const schema = joi.object({
            username: joi.string()
                .required()
                .min(2)
                .max(128),
            email: joi.string()
                .email()
                .required(),
            password: password_complexity().required()
        });
        await schema.validateAsync(req.body);
        next();
    } catch (err) {
        res.status(400).send(err.message);
    }
}