const express = require('express');
const { isLoggedIn,isSellerLoggedIn,isSpSellerLoggedIn,isUserLoggedIn } = require('../middleware');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/review');
const Seller = require('../models/seller');


// Display all the products
router.get('/products', async(req, res) => {
    
    try {
        const products=await Product.find({});
        res.render('products/index',{products}); 
    } catch (e) {
        console.log("Something Went Wrong");
        req.flash('error', 'Cannot Find Products');
        res.render('error');
    }
})

//Display all products of seller
router.get('/:sellerId/myproducts',isSellerLoggedIn, async(req, res) => {
    
    try {
        const seller=await (await Seller.findById(req.params.sellerId).populate('products'));
        res.render('products/myproducts',{seller}); 
    } catch (e) {
        console.log("Something Went Wrong");
        req.flash('error', 'Cannot Find Products');
        res.render('error');
    }
})

// Get the form for new product
router.get('/products/new', isSellerLoggedIn,(req, res) => {
    res.render('products/new');
})


// Create New Product
router.post('/:sellerId/products', isSellerLoggedIn, async(req, res) => {
    const seller=await Seller.findById(req.params.sellerId);
    try {
        const product=new Product({
            ...req.body.product,
            seller:req.user._id
        })
         
        const newproduct =await product.save();
        seller.products.push(newproduct);
        await seller.save();
        req.flash('success', 'Product Created Successfully');
        res.redirect('/products');
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot Create Products,Something is Wrong');
        res.render('error');
    } 
});


// Show particular product
router.get('/products/:id', async(req, res) => {
    try {
        const product=await (await Product.findById(req.params.id).populate('reviews').populate('seller'));
        res.render('products/show', { product});
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot find this Product');
        res.redirect('/error');
    }
})

// Get the edit form
router.get('/products/:id/edit', isSpSellerLoggedIn, async(req, res) => {

    try {
        const product=await Product.findById(req.params.id);
        res.render('products/edit',{product});
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot Edit this Product');
        res.redirect('/error');
    }
})

// Upadate the particular product
router.patch('/products/:id',isSpSellerLoggedIn, async(req, res) => {
    
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body.product);
        req.flash('success', 'Updated Successfully!');
        res.redirect(`/products/${req.params.id}`) 
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot update this Product');
        res.redirect('/error');
    }
})


// Delete a particular product
router.delete('/products/:id',isSpSellerLoggedIn, async (req, res) => {

    try {
        await Product.findByIdAndDelete(req.params.id);
        req.flash('success', 'Deleted the product successfully');
        res.redirect('/products');
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot delete this Product');
        res.redirect('/error');
    }
})




// Creating a New Comment on a Product

router.post('/products/:id/review', isLoggedIn, async (req, res) => {
    
    try {
        const product = await Product.findById(req.params.id);
        const review = new Review({
            ...req.body,
            user:req.user.username
        });

        product.reviews.push(review);

        await review.save();
        await product.save();

        req.flash('success','Successfully added your review!')
        res.redirect(`/products/${req.params.id}`);
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot add review to this Product');
        res.redirect('/error');
    }
    
})


router.get('/error', (req, res) => {
    res.status(404).render('error');
})


module.exports = router;