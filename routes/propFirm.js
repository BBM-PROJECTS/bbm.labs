const express = require("express");
const { propFirmValidationRules } = require("../validators/index.js");
const { PropFirmController } = require("../controllers/index.js");

const router = express.Router();

router.get("/all", PropFirmController.getAll);
router.delete("/remove/:id", PropFirmController.delete);
router.post("/create", propFirmValidationRules.create, PropFirmController.create);
router.put("/update/:id", propFirmValidationRules.update, PropFirmController.update);

module.exports = router;
