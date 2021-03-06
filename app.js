// const { sequelize } = require('./models');
// sequelize.sync({ alter: true });

require("dotenv").config();
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");

const { socketConnection } = require("./utils/socket-io");

const errorController = require("./controller/errorController");
const followingRoute = require("./routes/followingRoute");
const likeRoute = require("./routes/likeRoute");
const purchasedRoute = require("./routes/purchasedRoute");
const productCategoryRoute = require("./routes/productCategoryRoute");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const productRoute = require("./routes/productRoute");
const postRoute = require("./routes/postRoute");
const profileRoute = require("./routes/profileRoute");
const authRoute = require("./routes/authRoute");
const marketplaceRoute = require("./routes/marketplaceRoute");
const sidebarRoute = require("./routes/sidebarRoute");
const headerRoute = require("./routes/headerRoute");
const rankRoute = require("./routes/rankRoute");
const communityRoute = require("./routes/communityRoute");
const commentRoute = require("./routes/commentRoute");
const postCommunityRoute = require("./routes/postCommunityRoute");

const passport = require("passport");
require("./config/passport");
app.use(passport.initialize());

app.use(cors());
app.use(express.json());

//////////////////omise/////////////////////////////////////
const omiseRoute = require("./routes/omiseRoute");
app.use("/checkout-credit-card", omiseRoute);

///////////////////////////////////////////////////////
app.use("/community", communityRoute);
app.use("/rank", rankRoute);
app.use("/header", headerRoute);
app.use("/sidebar", sidebarRoute);
app.use("/marketplace", marketplaceRoute);
app.use("/following", followingRoute);
app.use("/like", likeRoute);
app.use("/purchased", purchasedRoute);
app.use("/category", productCategoryRoute);
app.use("/chat", chatRoute);
app.use("/product", productRoute);
app.use("/post", postRoute);
app.use("/comment", commentRoute);
app.use("/profile", profileRoute);
app.use("/user", userRoute);
app.use("/", authRoute);
app.use("/postCommunity", postCommunityRoute);

socketConnection(server);

app.use((req, res, next) => {
	res.status(404).json({ message: "resource not found on this server" });
});

app.use(errorController);

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`server running on port ${port}`));
