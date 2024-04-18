const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoClient = require('mongodb');
const uri = require('./atlas_uri');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://mpapa:' + process.env.MONGO_ATLAS_PW + '@databaseofmpapa.xrb9obi.mongodb.net/test',
{} 
);
mongoose.Promise = global.Promise;
//mongodb+srv://<username>:<password>@databaseofmpapa.xrb9obi.mongodb.net/?retryWrites=true&w=majority&appName=DatabaseOfMpapa
// mongodb://atlas-sql-65cf618fb4d5cb7b1dd9a210-fycxf.a.query.mongodb.net/test?ssl=true&authSource=admin
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });
    
module.exports = app; 