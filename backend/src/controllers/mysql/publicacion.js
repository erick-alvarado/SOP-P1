const pool = require("../../database/mysql");

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
    pool.query(
      `select p.*, h.tag as hashtags from Publicacion as p, Hashtag as h, Publicacion_Hashtag as ph 
      where ph.id_publicacion = p.id_publicacion and h.id_hashtag = ph.id_hashtag 
      group by p.id_publicacion, h.id_hashtag`,
      (err, response) => {
        if (err) console.log(err);
        let query = response;
        publicaciones = query.map((e, i) => {
          let newSchema = {
            id_publicacion: e.id_publicacion,
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
        res.json({ data: publicaciones });
        res.end();
      }
    );
  } catch (error) {
    return res.json({ data: publicaciones });
  }
};
