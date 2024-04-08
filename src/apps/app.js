const express = require("express");
const app = express();
const config = require("config");
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use("/assets", express.static(`${__dirname}/../public`));
app.set("views", `${__dirname}/../resources/views`);
app.set("view engine", "ejs");
app.use(config.get("app.prefixApiVersion"), require(`${__dirname}/../routers/web`));

module.exports = app;
