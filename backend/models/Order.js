const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true }, // 12 digits
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  materialName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Order Received', 'Cutting & Sizing', 'Stitching in Progress', 'Ready for Pickup'],
    default: 'Order Received'
  },
  receivedDate: { type: Date, default: Date.now },
  pickupDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
