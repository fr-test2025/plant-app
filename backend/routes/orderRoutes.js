
const express = require('express');
const { getOrders, updateOrder, deleteOrder, addOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/order', protect, getOrders);
router.post('/order', protect, addOrder);
router.delete('/order', protect, deleteOrder);
router.put('/order', protect, updateOrder);

module.exports = router;
