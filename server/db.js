const mysql = require('mysql2/promise');
let mysqlPool = null;
// if(process.env.NODE_ENV === 'production') {
    //  mysqlPool = mysql.createPool({
    //     host: process.env.RDS_HOSTNAME,
    //     user: process.env.RDS_USERNAME,
    //     port: process.env.RDS_PORT,
    //     password: process.env.RDS_PASSWORD,
    //     database: process.env.RDS_DB_NAME
    // });
// } 
//  mysqlPool = mysql.createPool({
//     host: 'digitsiedb.c5h5bn1ztyyt.eu-north-1.rds.amazonaws.com',
//     user: 'root',
//     port: 3306,
//     password: '12345678',
//     database: 'edtech'
// });

mysqlPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'edtech'
});


module.exports = mysqlPool;