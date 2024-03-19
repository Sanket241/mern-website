const Errorhandler = require('../Utilis/Errorhandler');
const CatchsyncError = require('../middleware/CatchsyncError')
const Products = require('../model/productModels')
const ApiFeatures = require('../Utilis/Apifeatures')


// GET ALL PRODUCTS
const getAllProducts= CatchsyncError (async(req,resp)=>{        //this is a unique way to handle try and catch error
    const resultPerPage = 4;
    const productCount = await Products.countDocuments();
    const apiFeatures = new ApiFeatures(Products.find(),req.query).search().filter().pagination(resultPerPage)
    const products = await apiFeatures.query
    resp.status(200).json({success:true,products,productCount})
})

// UPDATE PRODUCT
const updateProducts = async(req,resp)=>{
try {
    let product = await Products.findById(req.params.id)
    if(!product){
        resp.status(404).json({message:"Product Not Found", success:false})
    }
    product = await Products.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    resp.status(200).json({product, success:true})
} catch (error) {
    console.log(error)
}
}

// CREATE PRODUCT
const createProducts=async(req,resp)=>{
try {
    const datas = await Products.create(req.body)
    resp.status(200).json({datas})
} catch (error) {
    console.log(error)
}
}

// DELETE PRODUCT
const deleteProducts = async(req,resp)=>{
    try {
        let product = await Products.findById(req.params.id)
        if(!product){
            resp.status(404).json({message:"Product Not Found", success:false})
        }
        product = await Products.findByIdAndDelete(req.params.id)
        resp.status(200).json({product, success:true})
    } catch (error) {
        console.log(error)
    }

}

// GET PRODUCTS DETAILS

const getProductDetails =async(req,resp,next)=>{
    try {
        const product = await Products.findById(req.params.id)
        if(!product){
            return next(new Errorhandler("Product Not Found", 404))
        }
        resp.status(200).json({product, success:true})
    } catch (error) {
        resp.status(500).json({message:"Server Error", success:false})
    }
}

//  create new review or update the review
const createProductReview = CatchsyncError(async(req,resp)=>{
    const {rating,comment,productId} = req.body;
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product = await Products.findById(productId)
    const isReviewed = product.reviews.find(
        r=>r.user.toString() === req.user._id.toString()
    )
    if(isReviewed){
        product.reviews.forEach(review=>{
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment;
                review.rating = rating;
            }
        })
    }else{
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }
    product.ratings = product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length
    await product.save({validateBeforeSave:false})
    resp.status(200).json({success:true})
})

//to get all reviews of single product

const getProductReviews = CatchsyncError(async(req,resp,next)=>{
    const product = await Products.findById(req.query.id)
    if(!product){
        return next(new Errorhandler("Product Not Found", 404))
    }
    resp.status(200).json({success:true, reviews:product.reviews})

})
// Delete review
const deleteReview = CatchsyncError(async(req,resp,next)=>{
    const product = await Products.findById(req.query.productId)
    if(!product){
        return next(new Errorhandler("Product Not Found", 404))
    }
    const reviews = product.reviews.filter(review=>review._id.toString() !== req.query.id.toString())
    const numOfReviews = reviews.length
    const ratings = product.reviews.reduce((acc,item)=>item.rating+acc,0)/reviews.length
    await Products.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    resp.status(200).json({success:true})

})

module.exports = {createProducts, getAllProducts, updateProducts, deleteProducts, getProductDetails, createProductReview, getProductReviews, deleteReview}