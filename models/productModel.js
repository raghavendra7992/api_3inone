const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var prodDetailSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true,
        unique:true,
    },
   title:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    sold:{
        type:Boolean,
        required:true,
    },
    dateOfSale:{
        type:Date,
        required:true,
    },
    monthOfSale:{
        type:String,
        required:true,
    }

});

//Export the model
module.exports = mongoose.model('prodDetail', prodDetailSchema);