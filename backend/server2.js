const express=require('express');
const {connect}= require('mongoose');
const router=require('./src/routes/index.js');
const mongoose = require('mongoose');
const dotenv= require('dotenv');
var cors = require('cors');
const bodyParser = require('body-parser');

const app=express();
dotenv.config();
app.use(cors());

const PORT=process.env.PORT;

mongoose.connect(process.env.MONGO_URI3, { useNewUrlParser: true, dbName:"SDN302_CarRentalService",  useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// For parsing application/json
//app.use(express.json());
app.use(bodyParser.json());
app.use('/',router);

app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
});
