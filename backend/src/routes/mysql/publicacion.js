const express = require("express");
const router = express.Router();
const publicacion = require("../../controllers/mysql/publicacion");

router.get("/publicacion", publicacion.getAll);

module.exports = router;
