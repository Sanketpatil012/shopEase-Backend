const mongoose= require("mongoose")

const  wishListSchema=  mongoose.Schema({
    userId:{type: Schema.Types.ObjectId , ref:'categories'}
})

const WhisList = mongoose.model('categories' , wishListSchema)
module.exports = WhisList