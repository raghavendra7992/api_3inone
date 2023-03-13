const express=require('express');
// const { getSaledate } = require('../controller/prodcnt');
const prodcnt= require('../controller/prodcnt');
const router=express.Router();

// router.get('/getsales/:month',getSaledate)
router.get("/getSales/:month", prodcnt.getSales);
router.get("/getBar/:month", prodcnt.getBar);
router.get("/getPie/:month", prodcnt.getPie);
router.get('/combine/:month',prodcnt.combineData);




module.exports =router