const express = require("express");
const { newsletterValidationRules } = require("../validators/index.js");
const { NewsletterController } = require("../controllers/index.js");

const router = express.Router();

router.post("/subscribe", newsletterValidationRules.newsletter, NewsletterController.subscribe);

module.exports = router;
