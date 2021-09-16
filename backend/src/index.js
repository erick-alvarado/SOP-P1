require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const http = require("http");
const socketio = require("socket.io");

//Conexion a la base de datos
require("./database/mongoDB").conectar();
//require("./database/mysql");
const mongo = require("./routes/mongo/publicacion");
/* const mysql = require("./routes/mysql/publicacion"); */
const subscriber = require("./routes/subscriber/subscriber");

//settings
app.set("port", process.env.PORT);

//middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("conectado");
  socket.on("conectado", () => {
    console.log("Usuario conectado");
  });
});

//routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/mongo", mongo);
/* app.use("/mysql", mysql); */
app.use("/subscriber", subscriber);
//escuchando el servidor
server.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
