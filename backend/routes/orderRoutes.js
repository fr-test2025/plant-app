
const express = require('express');
const { getOrders, updateOrder, deleteOrder, addOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getOrders);
router.post('/', protect, addOrder);
router.delete('/:id', protect, deleteOrder);
router.put('/:id', protect, updateOrder);

module.exports = router;

