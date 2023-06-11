const express = require("express");
const app = express();
const { diSetup } = require("./di.setup")
const helmet = require("helmet");
const Config = require("./util/config");
const errorMiddleware = require("./middlewares/error");

if(!new Config().get("JWT_PRIVATE_KEY")) {
    console.error("FATAL ERROR: JWT_PRIVATE_KEY NOT FOUND!");
    process.exit(1);
}

diSetup().then(() => {
    app.use(express.json());
    app.use(helmet());
    app.use("/users", require("./routes/users.routes"));
    app.use(errorMiddleware);
})

const port = process.env.PORT || 5000;
app.listen(port, () => console.info(`listening on port ${port}`));