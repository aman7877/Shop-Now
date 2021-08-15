const mongoose=require('mongoose');
const passportLocalMongoose=require('passport-local-mongoose');

const userSchema=new mongoose.Schema({
    info:{
        type:String,
        default:"user"
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
        uniqure:true
    },
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Order'
        }
    ]
});

//It will self add a username and hash and salt to store the username and hashed password
userSchema.plugin(passportLocalMongoose);
const User=mongoose.model('User',userSchema);

module.exports=User;