const express = require("express");
const router = express.Router();
const subscriber = require("../../controllers/subscriber/subscriber");

router.get("/", subscriber.getAll);

module.exports = router;
