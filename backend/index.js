require("dotenv").config()
const app = require("./app");
const connectDb = require("./database/Conn");
const port = process.env.PORT || 9000;

// Handeling Uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log((`Shuting down the server due to uncaught Exception`));
    process.exit(1);
})




const start=async()=>{
    await connectDb(process.env.MONGO_URL)
  app.listen(port,()=>{
        console.log(`server is connect ${port}`)
    })
}
start();

// unhandled promise rejection
// process.on("unhandleRejection",(err)=>{
//     console.log(`Error: ${err.message}`);
//     console.log(`Shiting down the server due to unhandled promise Rejection`);
//     startServer.close(()=>{
//         process.exit(1);
//     })
// })
