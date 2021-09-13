require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
require("./database/mongoDB").conectar();
require("./database/mysql");
const mongo = require("./routes/mongo/publicacion");
const mysql = require("./routes/mysql/publicacion");

//settings
app.set("port", process.env.PORT);

//middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

//routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/mongo", mongo);
app.use("/mysql", mysql);

//escuchando el servidor
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
