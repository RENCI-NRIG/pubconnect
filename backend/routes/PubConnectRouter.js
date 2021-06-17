const PubConnectController = require('../controller/PubConnectController');
const express = require('express');
const PubConnectRouter = express.Router();

PubConnectRouter.get('/', (req) => {
    console.log("test")
})

PubConnectRouter.post('/insert', PubConnectController.PubConnectInsert);

module.exports = PubConnectRouter