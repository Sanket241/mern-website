const Errorhandler = require('../Utilis/Errorhandler');
const CatchsyncError = require('../middleware/CatchsyncError')
const Orders = require('../model/orderModel')
const Products = require('../model/productModels')

//Create a new order => /api/data/order/new
const newOrder = CatchsyncError(async(req,resp,next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        orderStatus,
        paidAt,
        deliveredAt
    } = req.body
    const order = await Orders.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        orderStatus,
        paidAt,
        deliveredAt,
        user:req.user._id,
        paidAt:Date.now()
    })
    resp.status(200).json({success:true,order})
})

//Get single order => /api/data/order/:id

const getSingleOrder = CatchsyncError(async(req,resp,next)=>{
    const order = await Orders.findById(req.params.id).populate(
        "user",
        "name email"
        );
    if(!order){
        return next(new Errorhandler('Order not found with this ID',404))
    }
    resp.status(200).json({success:true,order})
})

//Get logged in user orders => /api/data/orders/me
const myorders = CatchsyncError(async(req,resp,next)=>{
    const orders = await Orders.find({user:req.user._id})
    resp.status(200).json({success:true,orders})
})

const getAllorders = CatchsyncError(async(req,resp,next)=>{
    const orders = await Orders.find()
    let totalAmount = 0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice;
    })
    resp.status(200).json({success:true,totalAmount,orders})

})

// update Order Status -- Admin
const updateOrder = CatchsyncError(async (req, resp, next) => {
    const order = await Orders.findById(req.params.id);
  
    if (!order) {
      return next(new Errorhandler("Order not found with this Id", 404));
    }
  
    if (order.orderStatus === "Delivered") {
      return next(new Errorhandler("You have already delivered this order", 400));
    }
  
    if (req.body.status === "Shipped") {
      order.orderItems.forEach(async (o) => {
        await updateStock(o.product, o.quantity);
      });
    }
    order.orderStatus = req.body.status;
  
    if (req.body.status === "Delivered") {
      order.deliveredAt = Date.now();
    }
  
    await order.save({ validateBeforeSave: false });
    resp.status(200).json({
      success: true,
    });
  });
  
  async function updateStock(id, quantity) {
    const product = await Products.findById(id);
  
    product.Stock -= quantity;
  
    await product.save({ validateBeforeSave: false });
  }
  
  // delete Order -- Admin
  const deleteOrder = CatchsyncError(async (req, resp, next) => {
    const order = await Orders.findByIdAndDelete(req.params.id);
  
    if (!order) {
      return next(new Errorhandler("Order not found with this Id", 404));
    }
  
    resp.status(200).json({
      success: true,
    });
  });

module.exports = {newOrder, getSingleOrder, myorders, getAllorders, updateOrder, deleteOrder }
