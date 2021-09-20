require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

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

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
