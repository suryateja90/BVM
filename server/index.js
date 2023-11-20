const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const db = require('./db');
const routes = require('./router');
require('express-async-errors');
const environmentRoot = require('path').normalize(__dirname);
const tableDef = require('./utils/tablemodel');
// console.log('process logs',process.env)
const port = process.env.PORT || 8080;

// Allow all origins (you can configure this according to your needs)
app.use(cors({
    origin: '*' // Replace with your allowed origin
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(environmentRoot + '/public'));
app.use('/api', routes);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send('Something went wrong!');
  });

(async () => {
    try {
      await db.query("SELECT 1");
      console.log('Successful db connection');
      await tableDef.createTables();
      await tableDef.setGradeData();
    } catch (err) {
      console.error('Failed db connection: ', err);
    }
  
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  })();
