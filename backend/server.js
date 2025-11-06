require("dotenv").config()
const app = require("./src/app")
const connectDb = require("./src/db/db")
const http = require("http")
const initServer = require("./src/sockets/socket.server")

connectDb();

const httpServer = http.createServer(app)
initServer(httpServer)


httpServer.listen(3000,()=>{
    console.log('server is listen at port 3000.')
})