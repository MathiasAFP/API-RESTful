const router = require("express").Router();
const controller = require("../controllers/membros.controllers");
const auth = require("../middlewares/auth");

router.get("/", auth, controller.listar);
router.get("/:id", auth, controller.buscarPorId);
router.post("/", auth, controller.criar);
router.put("/:id", auth, controller.atualizar);
router.patch("/:id", auth, controller.atualizar);
router.delete("/:id", auth, controller.deletar);

module.exports = router;
