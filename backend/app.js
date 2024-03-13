const express = require('express')
const app = express()
const productRouter = require('./routes/productRoute')


app.use(express.json())
app.use("/api/data",productRouter)


module.exports = app