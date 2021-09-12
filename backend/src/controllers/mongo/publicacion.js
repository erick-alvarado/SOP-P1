const Publicacion = require("../../models/MongoPublicacion");

exports.getAll = async (req, res) => {
  let publicaciones = [];
  try {
    publicaciones = await Publicacion.find();
    console.log(publicaciones);
  } catch (error) {
    console.log(error);
  }
  res.json({ data: publicaciones });
};
