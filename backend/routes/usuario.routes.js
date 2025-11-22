const router = require("express").Router();
const controller = require("../controllers/usuario.controllers");

router.post("/registro", controller.registrar);
router.post("/login", controller.login);

module.exports = router;
