const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const User = require('../models/user');
const  { isLoggedIn } = require('../middleware');
const Usercart = require('../models/usercart');
const uniqid = require('uniqid');
const Order = require('../models/order');





// router.post('/user/:id/cart',  async (req, res)=>{
//     try{
//         const product = await Product.findById(req.params.id);
//         const user = req.user;



//         await user.cart.push(product);
//         await user.save();
//         req.flash('success','Added to your cart successfully');
//         res.redirect('/user/<%=req.user._id%>/cart');
//     }
//     catch(e){
//         req.flash('error','unable to add to cart');
//         res.render('error');
//     }
// })


router.post('/user/:id/cart', isLoggedIn,  async (req, res)=>{
    try{
        const product = await Product.findById(req.params.id);

        const user = req.user;
       
        const usercart=new Usercart({productid:product,userid:user});
        const found=await Usercart.findOne({productid:product,userid:user});
        if(found){
            
            found.quantity+=1;
            await found.save();
        }else{
            await usercart.save();
        }
        
        
        
        req.flash('success','Added to your cart successfully');
        res.redirect(`/user/${user._id}/cart`);
    }
    catch(e){
        req.flash('error','unable to add to cart');
        res.render('error');
    }
})

router.get('/user/:userId/cart',isLoggedIn, async (req,res)=>{
 try{
    // const user = await User.findById(req.user._id).populate('cart');
    
    // res.render('cart/showCart',{userCart:user.cart});
    // const {userid}=req.params.userId;
    // console.log(userid);

    const usercart=await Usercart.find({userid:req.params.userId}).populate('productid');

    res.render('cart/showCart',{usercart: usercart });


 }
 catch(e){
     req.flash('error','Can\'t load cart ');
     res.render('error');
 }
})

router.delete('/user/:userid/cart/:id',isLoggedIn, async (req,res)=>{
    const {userid,id}= req.params;
    
    await User.findByIdAndUpdate(userid,{$pull:{cart:id}});
    await Usercart.findOneAndDelete({userid:userid,productid:id});
    
    
    req.flash('success','removed from cart successfully');
    res.redirect(`/user/${userid}/cart`);
})



// router.get('/success',isLoggedIn, async(req, res) => {
//     //Payumoney will send Success Transaction data to req body. 
//     //  Based on the response Implement UI as per you want
    
//     const found=await Usercart.find({userid:req.user._id});
//     const cart=[];
//     for(item of found){
//         cart.push(item.productid);
//     }

    
    
//     try {
//         const order= {
//             txnid: uniqid.process(),
//             amount: 121,
//             orderedProducts: cart
//         }
        
//         const placedOrder=await Order.create(order);

//         const finduser = await User.findById(req.user._id);

//         finduser.orders.push(placedOrder);
    
//         await finduser.save();
    
//         req.flash('success','Your Order has been Successfully Placed.Thanks for Shopping with us!')
//         res.send("Pushed");
//     }
//     catch (e) {
//         console.log(e.message);
//         req.flash('error', 'Cannot Place the Order at this moment.Please try again later!');
//         res.render('error');
//     } 
// })


module.exports = router;

