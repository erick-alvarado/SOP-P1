const pool = require("../../database/mysql");

var meses = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

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
        if (err) return res.json({ data: publicaciones });
        let lista = [];
        let key = false;
        response.forEach((element, i) => {
          lista.forEach((e) => {
            if (e.id_publicacion === element.id_publicacion) {
              e.hashtags.push(element.hashtags);
              key = true;
            }
          });
          if (key) {
            key = false;
          } else {
            lista.push({
              id: convertir(i),
              id_publicacion: element.id_publicacion,
              nombre: element.nombre,
              comentario: element.comentario,
              fecha: element.fecha,
              upvotes: element.upvotes,
              downvotes: element.downvotes,
              hashtags: [element.hashtags],
            });
          }
        });
        return res.json({ data: lista });
      }
    );
  } catch (error) {
    return res.json({ data: publicaciones });
  }
};

exports.getConsulta1 = async (req, res) => {
  try {
    pool.query(
      `
    select COUNT(p.id_publicacion) as noticias, 
    (
      SELECT COUNT(h.tag) from Hashtag h 
    ) as hashtags,
    SUM(p.upvotes) as upvotes 
    from Publicacion p;`,
      (err, response) => {
        if (err) return res.json({ data: [] });
        return res.json({ data: response });
      }
    );
  } catch (error) {
    return res.json({ data: [] });
  }
};

exports.getConsulta2 = async (req, res) => {
  try {
    pool.query(
      `
      SELECT h.tag, SUM(p.upvotes) as total from Hashtag h, Publicacion p , Publicacion_Hashtag ph 
      WHERE p.id_publicacion = ph.id_publicacion and h.id_hashtag = ph.id_hashtag
      GROUP by h.tag
      ORDER by total desc
      limit 5`,
      (err, response) => {
        if (err) return res.json({ data: [] });
        return res.json({ data: response });
      }
    );
  } catch (error) {
    return res.json({ data: [] });
  }
};

exports.getUltimos = async (req, res) => {
  let publicaciones = [];
  try {
    pool.query(
      `select p.*, h.tag as hashtags from Publicacion as p, Hashtag as h, Publicacion_Hashtag as ph 
      where ph.id_publicacion = p.id_publicacion and h.id_hashtag = ph.id_hashtag 
      group by p.id_publicacion, h.id_hashtag`,
      (err, response) => {
        if (err) return res.json({ data: publicaciones });
        let lista = [];
        let key = false;
        response.forEach((element, i) => {
          lista.forEach((e) => {
            if (e.id_publicacion === element.id_publicacion) {
              e.hashtags.push(element.hashtags);
              key = true;
            }
          });
          if (key) {
            key = false;
          } else {
            lista.push({
              id_publicacion: element.id_publicacion,
              nombre: element.nombre,
              comentario: element.comentario,
              fecha: element.fecha,
              upvotes: element.upvotes,
              downvotes: element.downvotes,
              hashtags: [element.hashtags],
            });
          }
        });

        lista.length > 5 ? (lista = lista.slice(lista.length - 5)) : null;
        publicaciones = lista.map((e, i) => {
          let newSchema = {
            nombre: e.nombre,
            fecha: e.fecha,
            comentario: e.comentario,
            hashtags: "#" + e.hashtags.join(" #"),
          };
          return newSchema;
        });

        return res.json({ data: publicaciones });
      }
    );
  } catch (error) {
    return res.json({ data: publicaciones });
  }
};

exports.getVotos = async (req, res) => {
  try {
    pool.query(
      `
      select p.fecha , sum(p.upvotes) as upvotes, sum(p.downvotes) as downvotes from Publicacion p 
      group by p.fecha`,
      (err, response) => {
        if (err) return res.json({ data: [] });
        publicaciones = response.map((e) => {
          let nuevaFecha = new Date(e.fecha);
          return {
            fecha:
              meses[nuevaFecha.getMonth()] +
              " " +
              nuevaFecha.getDay() +
              " " +
              nuevaFecha.getFullYear(),
            upvotes: e.upvotes,
            downvotes: e.downvotes,
          };
        });
        return res.json({ data: publicaciones });
      }
    );
  } catch (error) {
    return res.json({ data: [] });
  }
};
