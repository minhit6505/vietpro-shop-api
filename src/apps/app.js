const express = require("express");
const app = express();
const config = require("config");
const cookieParder = require("cookie-parser");
const cors = require("cors");

const corsOptions = {
  //origin: "*",
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieParder());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/assets", express.static(`${__dirname}/../public`));
app.set("views", `${__dirname}/../resources/views`);
app.set("view engine", "ejs");
app.use(config.get("app.prefixApiVersion"), require(`${__dirname}/../routers/web`));

module.exports = app;
