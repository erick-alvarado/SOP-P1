const mongoose = require("mongoose");

const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;
const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const database = process.env.MONGO_NAME;

exports.conectar = async () => {
  await mongoose
    .connect(
      `mongodb://${user}:${password}@${host}:${port}/${database}?ssl=true`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() =>
      console.log("MongoDB is connected to:", mongoose.connection.name)
    )
    .catch((e) => console.log(e));
};
