const mongoose = require('mongoose')
const Schema = mongoose.Schema


const saleSchema = new Schema({
    saleDate: Date,
    items: [
      {
        name: String,
        tags: [String],
        price: String,
        quantity: Number
      }
    ],
    storeLocation: String,
    customer: {
      gender: String,
      age: Number,
      email: String,
      satisfaction: Number
    },
    couponUsed: Boolean,
    purchaseMethod: String
  })

module.exports = Sales = mongoose.model('sales', saleSchema)

// data:[
//   {
//     name:String,
//     country:String,
//     quantity:Number,
//   } 
// ]