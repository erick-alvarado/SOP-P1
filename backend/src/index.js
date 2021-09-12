require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
require("./database/mongoDB").conectar();
const mongoPublicacion = require("./routes/mongo/MongoPublicacion");

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

app.use("/mongo", mongoPublicacion);

//escuchando el servidor
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
