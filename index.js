const express = require('express')
const app = express()
const morgan = require('morgan')
const db=require("./config/db.js")
const productRoute=require("./routes/productroute.js")
const userroute = require("./routes/userroutes.js")

const Port=process.env.PORT ||3001;

require('dotenv').config();
db();

app.use("/date",productRoute)
app.use("/sales",userroute)
app.use(morgan("dev"));

app.listen(Port,()=>{console.log(`listening on port ${Port}`)})


