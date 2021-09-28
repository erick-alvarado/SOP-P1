const pool = require("../../database/mysql");

exports.getAll = async (req, res) => {
  try {
    pool.query(
      `select p.*, h.tag as hashtags from Publicacion as p, Hashtag as h, Publicacion_Hashtag as ph 
      where ph.id_publicacion = p.id_publicacion and h.id_hashtag = ph.id_hashtag 
      group by p.id_publicacion, h.id_hashtag`,
      (err, response) => {
        if (err) console.log(err);
        res.json({ data: response });
        res.end();
      }
    );
  } catch (error) {
    return res.json({ data: [] });
  }
};
