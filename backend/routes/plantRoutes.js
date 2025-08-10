
const express = require('express');
const { getPlants, updatePlant, deletePlant, addPlant } = require('../controllers/plantController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getPlants);
router.post('/', protect, addPlant);
router.delete('/', protect, deletePlant);
router.put('/', protect, updatePlant);

module.exports = router;
