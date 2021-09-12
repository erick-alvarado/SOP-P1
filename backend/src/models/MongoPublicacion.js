const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const publicacionSchema = new Schema({
  nombre: String,
  comentario: String,
  fecha: Date,
  hashtags: Array,
  upvotes: Number,
  downvotes: Number,
});

const Publicacion = mongoose.model("publicaciones", publicacionSchema);

module.exports = Publicacion;
