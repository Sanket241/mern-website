require("dotenv").config()
const app = require("./app");
const connectDb = require("./database/Conn");
const port = process.env.PORT || 9000;





const start=async()=>{
    await connectDb(process.env.MONGO_URL)
    app.listen(port,()=>{
        console.log(`server is connect ${port}`)
    })
}
start();

// //unhandled promise rejection
// process.on("unhandledRejection",(err)=>{
//     console.log(err.message)
//     console.log("Shutting down thius server due to unhandled promise rejection")
//     server.close(()=>{
//         process.exit(1)
//     })
// })