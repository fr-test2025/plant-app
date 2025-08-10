const Plant = require('../models/Plant');
const getPlants = async (req,res) => {
    try {
        const plants = await Plant.find({ });
        res.json(plants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addPlant = async (req, res) => {
const { name, stockCount, seasonality, description } = req.body;
    try {
        const plant = await Plant.create({ name, stockCount, seasonality, description });
        res.status(201).json(plant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePlant = async (req,res) => {
    const { name, stockCount, seasonality, description } = req.body;
    try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) return res.status(404).json({ message: 'Plant not found' });

        plant.name = name || plant.name;
        plant.description = description || plant.description;
        plant.stockCount = stockCount || plant.stockCount;
        plant.seasonality = seasonality || plant.seasonality;

        const updatedPlant = await Plant.save();
        res.json(updatedPlant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePlant = async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) return res.status(404).json({ message: 'Plant not found' });
        
        await plant.remove();
        res.json({ message: 'Plant deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPlants, addPlant, updatePlant, deletePlant };