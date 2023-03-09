const express = require("express");
const app = express();
const helmet = require("helmet");
const connect = require("./models/db.connection");
const { getConfig } = require("./util/config");

const errorMiddleware = require("./middlewares/error");
const usersRoute = require("./routes/users.routes");

if(!getConfig("JWT_PRIVATE_KEY")) {
    console.error("FATAL ERROR: JWT_PRIVATE_KEY NOT FOUND!");
    process.exit(1);
}

connect();

app.use(express.json());
app.use(helmet());
app.use("/users", usersRoute);
app.use(errorMiddleware);

const port = process.env.PORT | 5000;
app.listen(port, () => console.info(`listening on port ${port}`));
