
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Plant = require('../models/Plant');
const { updatePlant,getPlants,addPlant,deletePlant } = require('../controllers/plantController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('AddPlant Function Test', () => {

  it('should create a new plant successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { botanicalName: "New Plant Botanical", commonName: "New Plant Common", description: "Plant description", seasonality: "Spring", stockCount: 1 }
    };

    // Mock plant that would be created
    const createdPlant = { _id: new mongoose.Types.ObjectId(), ...req.body };

    // Stub Plant.create to return the createdPlant
    const createStub = sinon.stub(Plant, 'create').resolves(createdPlant);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addPlant(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdPlant)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Plant.create to throw an error
    const createStub = sinon.stub(Plant, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { botanicalName: "New Plant Botanical", commonName: "New Plant Common", description: "Plant description", seasonality: "Spring", stockCount: 1}
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addPlant(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('Update Function Test', () => {

  it('should update plant successfully', async () => {
    // Mock plant data
    const plantId = new mongoose.Types.ObjectId();
    const existingPlant = {
      _id: plantId,
      botanicalName: "Old Plant Botanical",
      commonName: "Old Plant Common",
      stockCount: 1,
      seasonality: "Spring",
      description: "Old Description",
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Plant.findById to return mock plant
    const findByIdStub = sinon.stub(Plant, 'findById').resolves(existingPlant);

    // Mock request & response
    const req = {
      params: { id: plantId },
      body: { botanicalName: "New Plant", seasonality: "Summer" }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updatePlant(req, res);

    // Assertions
    expect(existingPlant.botanicalName).to.equal("New Plant");
    expect(existingPlant.seasonality).to.equal("Summer");
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });



  it('should return 404 if plant is not found', async () => {
    const findByIdStub = sinon.stub(Plant, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updatePlant(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Plant not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Plant, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updatePlant(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });



});

describe('GetPlant Function Test', () => {

  it('should return plants', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock plant data
    const plants = [
      { _id: new mongoose.Types.ObjectId(), botanicalName: "Plant 1", commonName: "Common 1", stockCount: 1, seasonality: "Summer", description: "Description 1"},
      { _id: new mongoose.Types.ObjectId(), botanicalName: "Plant 2", commonName: "Common 2", stockCount: 2, seasonality: "Winter", description: "Description 2"}
    ];

    // Stub Plant.find to return mock plants
    const findStub = sinon.stub(Plant, 'find').resolves(plants);

    // Mock request & response
    const req = {};
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getPlants(req, res);

    // Assertions
    expect(findStub.calledOnceWith({})).to.be.true;
    expect(res.json.calledWith(plants)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Plant.find to throw an error
    const findStub = sinon.stub(Plant, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getPlants(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});

describe('DeletePlant Function Test', () => {

  it('should delete a plant successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock plant found in the database
    const plant = { remove: sinon.stub().resolves() };

    // Stub Plant.findById to return the mock plant
    const findByIdStub = sinon.stub(Plant, 'findById').resolves(plant);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deletePlant(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(plant.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Plant deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if plant is not found', async () => {
    // Stub Plant.findById to return null
    const findByIdStub = sinon.stub(Plant, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deletePlant(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Plant not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Plant.findById to throw an error
    const findByIdStub = sinon.stub(Plant, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deletePlant(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});