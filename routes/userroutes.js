const express = require("express");
const router = express.Router();
const usercnt= require("../controller/usercnt");

router.get("/getData", usercnt.getData);
router.get("/getCombined/:month", usercnt.getCombinedResponse);

module.exports = router;