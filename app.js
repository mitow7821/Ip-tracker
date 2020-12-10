const express = require("express");
require("dotenv").config();
const axios = require("axios");
const livereload = require("livereload");
const path = require("path");
const connectLivereload = require("connect-livereload");

const publicDirectory = path.join(__dirname, "public");

const livereloadServer = livereload.createServer();
livereloadServer.watch(publicDirectory);
livereloadServer.server.once("connection", () => {
  setTimeout(() => {
    livereloadServer.refresh("/");
  }, 100);
});

const app = express();

app.use(connectLivereload());

app.set("view engine", "ejs");

app.listen(process.env.PORT || 3001, () => {
  console.log("Listening at port http://localhost:3001/");
});

app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: true }));

const getData = async (ip) => {
  const apiURL = `https://geo.ipify.org/api/v1?apiKey=${process.env.API_KEY}&ipAddress=${ip}`;
  const response = await axios.get(apiURL);
  return response.data;
};

app.get("/", async (req, res) => {
  app.locals.data = app.locals.data || { ip: "8.8.8.8" };
  let data;
  try {
    data = await getData(app.locals.data.ip).then((response) => {
      return response;
    });
  } catch (err) {
    data = null;
  }

  res.render("index", { data });
});

app.post("/", async (req, res) => {
  app.locals.data = {};
  app.locals.data = req.body;
  let data;
  try {
    data = await getData(app.locals.data.ip).then((response) => {
      return response;
    });
  } catch (err) {
    data = null;
  }

  res.render("index", { data });
});

app.get("/api", async (req, res) => {
  res.json({ lat: "srat" });
});
//404 page
app.use((req, res) => {
  res.status(404).sendFile("./views/404.html", { root: __dirname });
});
