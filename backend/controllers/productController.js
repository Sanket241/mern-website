const Products = require('../model/productModels')

const getAllProducts=async(req,resp)=>{
    const products =  await Products.find();
    resp.status(200).json(products)
}

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

const getProductDetails =async(req,resp)=>{
    try {
        const product = await Products.findById(req.params.id)
        if(!product){
            resp.status(404).json({message:"Product Not Found", success:false})
        }
        resp.status(200).json({product, success:true})
    } catch (error) {
        resp.status(500).json({message:"Server Error", success:false})
    }
}
module.exports = {createProducts, getAllProducts, updateProducts, deleteProducts, getProductDetails}