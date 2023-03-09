const mongoose = require("mongoose");

module.exports = async function connect(){
    try {
        await mongoose.connect("mongodb+srv://asapouya:Gozgoz1234@storiescluster.euhfaq8.mongodb.net/Users?retryWrites=true&w=majority");
        console.info("connected to users db.");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}