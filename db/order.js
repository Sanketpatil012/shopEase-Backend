

const mongoose= require("mongoose")

const  orderSchema=  mongoose.Schema({
    date:Date,
    items:Array(any),
    data:Number

})

const Order= mongoose.model('orders' , orderSchema)  
module.exports = Order





