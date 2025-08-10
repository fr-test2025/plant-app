
const express = require('express');
const { getPlants, updatePlant, deletePlant, addPlant } = require('../controllers/plantController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/plant', protect, getPlants);
router.post('/plant', protect, addPlant);
router.delete('/plant', protect, deletePlant);
router.put('/plant', protect, updatePlant);

module.exports = router;
