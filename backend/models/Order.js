
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: String, required: true, unique: true },
    description: { type: String },
    completed: { type: String, enum: ['Filled', 'Not Filled'] },
    deliveryDate: { type: Date },
});

module.exports = mongoose.model('Order', orderSchema);
