const express = require("express");
const { contactValidationRules } = require("../validators/index.js");
const { ContactController } = require("../controllers/index.js");

const router = express.Router();

router.post("/contact-us", contactValidationRules.contactUs, ContactController.contactUs);

module.exports = router;
