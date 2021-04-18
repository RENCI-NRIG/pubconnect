const PubConnectController = require('../controller/PubConnectController');
const express = require('express');
const PubConnectRouter = express.Router();

PubConnectRouter.get('/', (req) => {
    console.log("test")
})

PubConnectRouter.post('/save_user', PubConnectController.PubConnectSaveUser)
PubConnectRouter.post('/insert', PubConnectController.PubConnectInsert)
PubConnectRouter.post('/save', PubConnectController.PubConnectSave)


module.exports = PubConnectRouter