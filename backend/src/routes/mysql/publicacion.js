const express = require("express");
const router = express.Router();
const publicacion = require("../../controllers/mysql/publicacion");

router.get("/", publicacion.getAll);
router.get("/consulta1", publicacion.getConsulta1);
router.get("/consulta2", publicacion.getConsulta2);
router.get("/ultimos", publicacion.getUltimos);
router.get("/votos", publicacion.getVotos);

module.exports = router;
