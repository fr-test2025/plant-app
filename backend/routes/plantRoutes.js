
const express = require('express');
const { getPlants, updatePlant, deletePlant, addPlant } = require('../controllers/plantController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getPlants);
router.post('/', protect, addPlant);
router.delete('/:id', protect, deletePlant);
router.put('/:id', protect, updatePlant);

module.exports = router;
