const router = require("express").Router();
const controller = require("../controllers/membros.controllers");
const auth = require("../middlewares/auth");

router.get("/", auth, controller.listar);
router.post("/", auth, controller.criar);
router.delete("/:id", auth, controller.deletar);

module.exports = router;
