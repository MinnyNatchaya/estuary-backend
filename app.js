// const { sequelize } = require("./models");
// sequelize.sync({ alter: true });

require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");

const { socketConnection } = require("./utils/socket-io");

const errorController = require("./controller/errorController");

const chatRoute = require("./routes/chatRoute");
const profileRoute = require("./routes/profileRoute");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");

const passport = require("passport");
require("./config/passport");
app.use(passport.initialize());

app.use(cors());
app.use(express.json());

app.use("/chat", chatRoute);
app.use("/profile", profileRoute);
app.use("/user", userRoute);
app.use("/", authRoute);

socketConnection(server);

app.use((req, res, next) => {
	res.status(404).json({ message: "resource not found on this server" });
});

app.use(errorController);

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`server running on port ${port}`));
