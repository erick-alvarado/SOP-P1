const express = require("express");
const router = express.Router();
const publicacion = require("../../controllers/mysql/publicacion");

router.get("/", publicacion.getAll);

module.exports = router;
