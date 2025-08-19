require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    credentials: true,
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

const mainRoutes = require("./src/routes/mainRoutes");

app.use("/api", mainRoutes);

app.get("/", (req, res) => {
  res.send(
    `Hello  web services, Server  is running on port : ${process.env.PORT}`
  );
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running   at ${process.env.PORT}`);
});
