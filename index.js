const express = require('express');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
const path = require('path');


const app = express();
app.use(cors());
dotEnv.config();

mongoose.connect(process.env.Mongo_URI)
.then(()=>{
    console.log("DB connected sucessfully");
    
})
.catch((err)=>{
    console.log(err);
    
})

app.use(bodyParser.json());
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));

app.listen(3000,()=>{
    console.log("server started at 3000");
    
})
