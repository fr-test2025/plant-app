
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Order = require('../models/Order');
const { updateOrder,getOrders,addOrder,deleteOrder } = require('../controllers/orderController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('AddOrder Function Test', () => {

  it('should create a new order successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { orderNumber: 1, description: "Order description", completed: "Filled", deliveryDate: new Date() }
    };

    // Mock order that would be created
    const createdOrder = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Order.create to return the createdOrder
    const createStub = sinon.stub(Order, 'create').resolves(createdOrder);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addOrder(req, res);

    console.log('created ', createdOrder)

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdOrder)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Order.create to throw an error
    const createStub = sinon.stub(Order, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { botanicalName: "New Order Botanical", commonName: "New Order Common", description: "Order description", seasonality: "Spring", stockCount: 1}
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addOrder(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('Update Function Test', () => {

  it('should update order successfully', async () => {
    // Mock order data
    const orderId = new mongoose.Types.ObjectId();
    const existingOrder = {
      _id: orderId,
      orderNumber: 1,
      description: "Old description",
      completed: "Filled",
      deliveryDate: new Date(),
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Order.findById to return mock order
    const findByIdStub = sinon.stub(Order, 'findById').resolves(existingOrder);

    // Mock request & response
    const req = {
      params: { id: orderId },
      body: { orderNumber: 2, description: "New description", completed: "Not Filled" }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateOrder(req, res);

    // Assertions
    expect(existingOrder.orderNumber).to.equal(2);
    expect(existingOrder.description).to.equal("New description");
    expect(existingOrder.completed).to.equal("Not Filled")
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });



  it('should return 404 if order is not found', async () => {
    const findByIdStub = sinon.stub(Order, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateOrder(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Order not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Order, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateOrder(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });



});

describe('GetOrder Function Test', () => {

  it('should return orders', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock order data
    const orders = [
      { _id: new mongoose.Types.ObjectId(), orderNumber: 1, description: "Order description 1", completed: "Filled", deliveryDate: new Date(), userId},
      { _id: new mongoose.Types.ObjectId(), orderNumber: 2, description: "Order description 2", completed: "Not Filled", deliveryDate: new Date(), userId},
    ];

    // Stub Order.find to return mock orders
    const findStub = sinon.stub(Order, 'find').resolves(orders);

    // Mock request & response
    const req = {user: { id: userId }};
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getOrders(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(orders)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Order.find to throw an error
    const findStub = sinon.stub(Order, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getOrders(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});

describe('DeleteOrder Function Test', () => {

  it('should delete a order successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock order found in the database
    const order = { remove: sinon.stub().resolves() };

    // Stub Order.findById to return the mock order
    const findByIdStub = sinon.stub(Order, 'findById').resolves(order);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteOrder(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(order.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Order deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if order is not found', async () => {
    // Stub Order.findById to return null
    const findByIdStub = sinon.stub(Order, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteOrder(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Order not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Order.findById to throw an error
    const findByIdStub = sinon.stub(Order, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteOrder(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});