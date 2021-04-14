const express = require('express')
const cors = require('cors');
const { initializeDB } = require('./config/db');
const PubConnectRouter = require('./routes/PubConnectRouter')
const app = express()
const port = 5000


initializeDB();
app.use(cors())
app.use(express.json());

app.use('/', PubConnectRouter);

app.listen(port, () => {
    console.log(`Pubconnect backend services listening at port ${port}`)
})