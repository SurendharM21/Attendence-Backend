const express= require("express")

const app = express()
const cors=require("cors")
const cookieParser = require("cookie-parser")
const errormiddleware = require("./middleware/error")

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
  
app.use(cors())
app.use(
    cors({
      origin:"*",
    })
  );
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin' , '*');
    res.header('Access-Control-Allow-Headers', '*');
  
    next();
  });
  const user = require("./routes/userRoute.js")


  app.use("/api/v1",user)
  app.use(errormiddleware)

module.exports =app