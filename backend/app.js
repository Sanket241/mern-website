const express = require('express')
const app = express()
const productRouter = require('./routes/productRoute')
const userRouter = require('./routes/userRoute')
const errorMiddleware = require('./middleware/Error')

app.use(express.json())
app.use("/api/data",productRouter)
app.use("/api/data",userRouter)

//Error middleware
app.use(errorMiddleware)


module.exports = app