const express = require('express')
const connectDB = require('./config/db')
const app = express()
const port = 5000

connectDB();

app.get('/', (req, res) => {
    res.send("Backend visited!")
})

app.listen(port, () => {
    console.log(`Pubconnect backend services listening at port ${port}`)
})