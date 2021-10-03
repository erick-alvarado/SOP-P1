const express = require("express");
const router = express.Router();
const publicacion = require("../../controllers/mongo/publicacion");

router.get("/", publicacion.getAll);
router.get("/reportes", publicacion.getReportes);
router.get("/ultimos", publicacion.getUltimos);
router.get("/votos", publicacion.getvotosPorDia);

module.exports = router;
