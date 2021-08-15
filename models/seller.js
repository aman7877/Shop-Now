const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');
const Product=require('./product');

const sellerSchema=new mongoose.Schema({
    info:{
        type:String,
        default:"seller"
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    products:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }
]
});

//It will self add a username and hash and salt to store the username and hashed password
sellerSchema.plugin(passportLocalMongoose);
const Seller=mongoose.model('Seller',sellerSchema);

module.exports=Seller;