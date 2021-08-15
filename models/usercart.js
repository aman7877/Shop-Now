const mongoose = require('mongoose');

const Product=require('./product');
const User=require('./user');

const usercartSchema = new mongoose.Schema({
    userid:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    productid:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    },
    quantity:{
        type:Number,
        default:1
    } 
       
});


 const Usercart= mongoose.model('Usercart', usercartSchema);

 module.exports = Usercart;