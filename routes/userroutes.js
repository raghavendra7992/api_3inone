const express = require("express");
const router = express.Router();
const usercnt= require("../controller/usercnt");

router.get("/getData", usercnt.getData);
router.get("/getCombinedResponse/:month", usercnt.getCombinedResponse);

module.exports = router;