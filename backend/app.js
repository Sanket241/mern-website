const express = require('express')
const app = express()
const productRouter = require('./routes/productRoute')
const userRouter = require('./routes/userRoute')
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middleware/Error')

app.use(express.json())
app.use(cookieParser())
app.use("/api/data",productRouter)
app.use("/api/data",userRouter)

//Error middleware
app.use(errorMiddleware)


module.exports = app