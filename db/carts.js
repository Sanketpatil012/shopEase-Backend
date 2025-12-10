
const mongoose= require("mongoose")

const  cartSchema=  mongoose.Schema({
    userId:{type: Schema.Types.ObjectId , ref:'categories'} , 
    productId:Array(String)
})

const Cart = mongoose.model('carts' , wishListSchema)
module.exports =  Cart