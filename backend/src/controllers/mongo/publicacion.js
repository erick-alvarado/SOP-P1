const Publicacion = require("../../models/MongoPublicacion");

exports.getAll = async (req, res) => {
  let publicaciones = [];
  let identificador = 1;
  const convertir = (num) => {
    if (num < 100) return num;
    if (identificador === 100) identificador = 0;
    identificador++;
    return identificador;
  };
  try {
    let query = await Publicacion.find();
    publicaciones = query.map((e, i) => {
      let newSchema = {
        id: convertir(i),
        nombre: e.nombre,
        comentario: e.comentario,
        fecha: e.fecha,
        hashtags: e.hashtags,
        upvotes: e.upvotes,
        downvotes: e.downvotes,
      };
      return newSchema;
    });
    //console.log(publicaciones);
  } catch (error) {
    console.log(error);
  }
  res.json({ data: publicaciones });
};
