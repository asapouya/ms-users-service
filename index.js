const express = require("express");
const app = express();
const helmet = require("helmet");

const usersRoute = require("./routes/users.routes");

app.use(helmet());
app.use(usersRoute);



const port = process.env.PORT | 5000;
app.listen(port, () => console.info(`listening on port ${port}`));