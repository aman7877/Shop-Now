if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');


const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Seller=require('./models/seller');


// Routes
const productRoutes = require('./routes/product');
const authRoutes=require('./routes/auth');
const sellerauthRoutes=require('./routes/sellerauth');
const profileRoutes=require('./routes/profile');
const cartRoutes = require('./routes/cart');
const paymentRoutes=require('./routes/payment');
const userRoutes = require('./routes/user');

// const seedDB = require('./seed');

mongoose.connect(process.env.DB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false,
        useCreateIndex: true
    })
    .then(() => {
        console.log("DB Connected");
    })
    .catch((err) => {
        console.log("OH NO ERROR!!!");
        console.log(err);
    });

// seedDB();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const sessionConfig={
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}
app.use(session(sessionConfig));
app.use(flash());

//Initilising the passport and sessions for storing the users info
app.use(passport.initialize());
app.use(passport.session());



//configuring the passport to use local strategy
passport.use(User.createStrategy());
passport.use(Seller.createStrategy());

passport.use('user', new LocalStrategy(User.authenticate()));
passport.use('seller', new LocalStrategy(Seller.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(function(user, done) { 
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    if(user!=null)
      done(null,user);
  });

app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user; 
    
    next();
})

app.get('/',(req,res)=>{
    res.render("home");
})

app.use(productRoutes);
app.use(authRoutes);
app.use(sellerauthRoutes);
app.use(profileRoutes);
app.use(cartRoutes);
app.use(paymentRoutes);
app.use(userRoutes);

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server running on port 3000")
})