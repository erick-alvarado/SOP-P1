const Publicacion = require("../../models/MongoPublicacion");

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

exports.getReportes = async (req, res) => {
  let publicaciones = [];
  try {
    let query = await Publicacion.find();

    let noticias = query.length;
    publicaciones.push({ noticias: noticias });

    let upvotes = query.reduce((sum, value) => sum + value.upvotes, 0);
    publicaciones.push({ upvotes: upvotes });

    let top = {};

    query.forEach((registro) => {
      registro.hashtags.forEach((tag) => {
        top[tag] = top[tag] ? top[tag] + registro.upvotes : registro.upvotes;
      });
    });

    top = Object.keys(top).map((tag) => {
      return { nombre: tag, total: top[tag] };
    });

    top = top.sort((a, b) => b.total - a.total);

    publicaciones.push({ hashtags: top.length });

    top.length > 5 ? (top = top.slice(0, 5)) : null;

    publicaciones.push({ top: top });
  } catch (error) {
    console.log(error);
  }
  res.json({ data: publicaciones });
};

exports.getUltimos = async (req, res) => {
  let publicaciones = [];
  try {
    let query = await Publicacion.find().sort({ _id: -1 }).limit(5);
    publicaciones = query.map((e, i) => {
      let newSchema = {
        nombre: e.nombre,
        fecha: e.fecha,
        comentario: e.comentario,
        hashtags: "#" + e.hashtags.join(" #"),
      };
      return newSchema;
    });
    //console.log(publicaciones);
  } catch (error) {
    console.log(error);
  }
  res.json({ data: publicaciones.reverse() });
};

exports.getvotosPorDia = async (req, res) => {
  let publicaciones = [];
  try {
    let query = await Publicacion.find();

    let result = {};

    query.forEach((registro) => {
      result[registro.fecha] = result[registro.fecha]
        ? result[registro.fecha].upvotes + registro.upvotes &&
          result[registro.fecha].downvotes + registro.downvotes
        : { upvotes: registro.upvotes, downvotes: registro.downvotes };
    });

    result = Object.keys(result).map((fecha) => {
      let nuevaFecha = new Date(fecha);
      return {
        fecha:
          meses[nuevaFecha.getMonth()] +
          " " +
          nuevaFecha.getDay() +
          " " +
          nuevaFecha.getFullYear(),
        upvotes: result[fecha].upvotes,
        downvotes: result[fecha].downvotes,
      };
    });

    publicaciones.push({ data: result });
  } catch (error) {
    console.log(error);
  }
  res.json({ data: publicaciones });
};
