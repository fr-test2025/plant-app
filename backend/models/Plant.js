
const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
    stockCount: { type: Number, min:0, required: true},
    seasonality: {type: String, enum : ['Summer', 'Winter', 'Spring', 'Autumn']},
    description: { type: String },

});

module.exports = mongoose.model('Plant', plantSchema)