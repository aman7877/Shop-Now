const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');


router.get('/loginregister',(req,res)=>{
    res.render('auth/loginregister');
})
router.get('/register', (req, res) => {
    res.render('auth/signup');
})

router.post('/register', async (req, res) => {
    
    try {
        const user = new User({ firstname: req.body.firstname,lastname:req.body.lastname,username: req.body.username, email: req.body.email });
        const newUser = await User.register(user, req.body.password);
        req.flash('success', `Registered Successfully !!! Welcome to Shoping Cart ${newUser.firstname}`);
        res.redirect('/products');

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
});



//get the logIn form
router.get('/login',(req,res)=>{
    res.render('auth/login');
});

router.post('/login',
  passport.authenticate('user', { 
    failureRedirect: '/login',
    failureFlash: true 
    }),(req,res)=>{
        req.flash('success',`Welcome Back!! ${req.user.username}`);
        res.redirect('/products');
    }
);

//logOut
router.get('/logout', function(req, res){
    req.logout();
    req.flash('success','Logged Out Sucessfully');
    res.redirect('/login');
  });

module.exports = router;