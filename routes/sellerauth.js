const express = require('express');
const router = express.Router();
const Seller = require('../models/seller');
const passport = require('passport');

router.get('/registerseller', (req, res) => {
    res.render('sellerauth/signup');
})

router.post('/registerseller', async (req, res) => {
    
    try {
        const seller = new Seller({
             firstname: req.body.firstname,
             lastname:req.body.lastname,
             username: req.body.username,
              email: req.body.email ,
              address:req.body.address,
              state:req.body.state,
              pincode:req.body.pincode
            
            });
        const newSeller = await Seller.register(seller, req.body.password);
        req.flash('success', 'Registered Successfully !!!');
        
        res.redirect('/products');

    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/registerseller')
    }
});

//get the logIn form
router.get('/loginseller',(req,res)=>{
    res.render('sellerauth/login');
});

router.post('/loginseller',
  passport.authenticate('seller', { 
    failureRedirect: '/loginseller',
    failureFlash: true 
    }),(req,res)=>{
        res.locals.currentSeller=req.user.username;
        req.flash('success',`Welcome Back!! ${req.user.username}`);
        res.redirect('/products');
    }
);

//log Out
router.get('/logoutseller', function(req, res){
    req.logout();
    req.flash('success','Logged Out Sucessfully');
    res.redirect('/loginseller');
  });

module.exports=router;