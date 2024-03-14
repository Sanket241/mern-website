const express = require('express')
const app = express()
const productRouter = require('./routes/productRoute')
const errorMiddleware = require('./middleware/Error')

app.use(express.json())
app.use("/api/data",productRouter)

//Error middleware
app.use(errorMiddleware)


module.exports = app