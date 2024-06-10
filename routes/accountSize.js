const express = require("express");
const { accountSizeValidationRules } = require("../validators/index.js");
const { AccountSizeController } = require("../controllers/index.js");

const router = express.Router();

router.get("/all", AccountSizeController.getAll);
router.delete("/remove/:id", AccountSizeController.delete);
router.post("/create", accountSizeValidationRules.create, AccountSizeController.create);
router.put("/update/:id", accountSizeValidationRules.update, AccountSizeController.update);

module.exports = router;
