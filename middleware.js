const Product = require("./models/product");

const isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You Need to LogIn first');
        return res.redirect('/login');
    }
    next();
}

const isSellerLoggedIn=(req,res,next)=>{
    if(req.isAuthenticated()){
        if(req.user.info!="seller"){
        
            req.flash('error','Only Seller can Acess this!! If You are a Seller,Kindly Login with Seller ID');
            return res.redirect('/loginseller');
        }
        next();
    }
    
    else{
        req.logout();
        req.flash('error','Only Seller can Acess this!! If You are a Seller,Kindly Login with Seller ID');
        return res.redirect('/loginseller');
    }
    
}

const isSpSellerLoggedIn= async(req,res,next)=>{
     const product= await Product.findById(req.params.id)
    if(req.user.info=="seller" && req.user._id==product.seller){
        if(!req.isAuthenticated()){
            req.flash('error','You can Modify Only Your Products');
            return res.redirect(`${req.user._id}/myproducts`);
        }
        next();
    }
    else if(req.user.info=="seller" ){
        if(!req.isAuthenticated()){
            req.flash('error','You can Modify Only Your Products');
            return res.redirect(`${req.user._id}/myproducts`);
        }
    }
    else{
        req.logout();
        req.flash('error','Only Seller can Acess this!! If You are a Seller,Kindly Login with Seller ID');
        return res.redirect('/loginseller');
    }
    
}

const isUserLoggedIn=(req,res,next)=>{
    if(req.user.info=="user"){
        if(!req.isAuthenticated()){
            req.flash('error','You Need to LogIn first');
            return res.redirect('/loginregister');
        }
        next();
    }
    else{
        req.logout();
        req.flash('error','Only User can Acess this!! If You are a User,Kindly Login with User ID');
        return res.redirect('/login');
    }
    
}

module.exports={
    isLoggedIn ,isSellerLoggedIn,isSpSellerLoggedIn,isUserLoggedIn
};