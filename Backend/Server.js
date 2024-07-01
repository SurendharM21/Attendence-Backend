const app = require("./App")
const dotenv =require("dotenv")
const path = require("path")
const connectDatabase = require("./config/database")
dotenv.config({path : path.join(__dirname,'./config/config.env')})
const port = process.env.PORT

connectDatabase()

app.listen(port,()=>{
    console.log(`Server Started ${port}`)
})
