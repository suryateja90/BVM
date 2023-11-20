const db = require('../db');
const moment = require('moment');

module.exports.logTeacher = async (table, name, pwd) => {
    const [rows] = await db.execute(`SELECT * FROM ${table} WHERE name = ? AND password = ?`, [name, pwd])
        .catch(err => err);

    if (rows.length > 0) {
        const modifiedRows = rows.map(row => {
            // Create a copy of the object without the 'password' key
            const { password, ...newRow } = row;
            return newRow;
        });
        return modifiedRows[0];
    } else {
        return [];
    }
}

module.exports.logAdmin = async (table, name, pwd) => {
    const [rows] = await db.execute(`SELECT * FROM ${table} WHERE name = ? AND password = ?`, [name, pwd])
        .catch(err => err);

    if (rows.length > 0) {
        const modifiedRows = rows.map(row => {
            // Create a copy of the object without the 'password' key
            const { password, ...newRow } = row;
            return newRow;
        });
        return modifiedRows[0];
    } else {
        return [];
    }
}

module.exports.logStudent = async (table, name, pwd) => {
    const [rows] = await db.execute(`SELECT * FROM ${table} WHERE name = ? AND password = ?`, [name, pwd])
        .catch(err => err);

    if (rows.length > 0) {
        const modifiedRows = rows.map(row => {
            // Create a copy of the object without the 'password' key
            const { password, ...newRow } = row;
            return newRow;
        });
        return modifiedRows[0];
    } else {
        return [];
    }
}

module.exports.getEarnings = async (id) => {
    try {
        const [demoRows] = await db.execute(`
            SELECT *
            FROM demo_events
            WHERE teacher_id = ? AND status = 'approved'
        `, [id]);

        const [eventRows] = await db.execute(`
            SELECT *
            FROM events
            WHERE teacher_id = ? AND status = 'approved'
        `, [id]);

        const currentMonth = moment().month() + 1;
        const lastMonth = moment().subtract(1, 'month').month() + 1;
        const beforeLastMonth = moment().subtract(2, 'month').month() + 1;

        // fetching records with in the last 3 months
        const filterByMonth = (data, name) => {
            return data.filter(item => {
                const startDate = moment(item[name]);
                const itemMonth = startDate.month() + 1;
                return (itemMonth === currentMonth || itemMonth === lastMonth || itemMonth === beforeLastMonth);
            });
        };

        let earningData =  {
            demo: filterByMonth(demoRows, 'startDate'),
            event: filterByMonth(eventRows, 'start_date')
        };
        let finalData = {
            teacher_id: id,
            currentMonth: {
                paid: 0,
                demo: 0
            },
            lastMonth: {
                paid: 0,
                demo: 0
            },
            beforeLastMonth: {
                paid: 0,
                demo: 0
            }
        }
        earningData.demo.forEach((v) => {
            const startDate = moment(v.startDate);
            const itemMonth = startDate.month() + 1;
            if(itemMonth === currentMonth) {
                finalData.currentMonth.demo++;
            }
            if(itemMonth === lastMonth) {
                finalData.lastMonth.demo++;
            }
            if(itemMonth === beforeLastMonth) {
                finalData.beforeLastMonth.demo++;
            }
        });

        earningData.event.forEach((v) => {
            const startDate = moment(v.start_date);
            const itemMonth = startDate.month() + 1;
            if(itemMonth === currentMonth) {
                finalData.currentMonth.paid++;
            }
            if(itemMonth === lastMonth) {
                finalData.lastMonth.paid++;
            }
            if(itemMonth === beforeLastMonth) {
                finalData.beforeLastMonth.paid++;
            }
        });

        return finalData;
    } catch (error) {
        // Handle error
    }
};


module.exports.getData = async (table) => {
    const [data] = await db.execute(`SELECT * FROM ${table}`)
        .catch(err => err);
    if(data && data.length) {
        return data;
    }
    return null;
}


module.exports.eventDemoEdit = async (table,paramObj) => {
    try {
        // Insert the data into the events table
        const id = Number(paramObj.id);

        if (isNaN(id) || !Number.isInteger(id)) {
          throw new Error('Invalid or missing ID in the parameter object.');
        }

        if(paramObj.completed) {
            paramObj.status = 'completed'
        } 
        if (paramObj.approved) {
            paramObj.status = 'approved'
        }
        
        const values = [
            paramObj.eventdetails || null,
            paramObj.stdname || null,  // Changed 'class' to 'stdname'
            paramObj.startDate || null,
            paramObj.endDate || null,
            paramObj.assigned || false,  // Assuming 'assigned' is a boolean field
            paramObj.completed || false, // Assuming 'completed' is a boolean field
            paramObj.approved || false,  // Assuming 'approved' is a boolean field
            paramObj.status || null
          ];
          
          const [rows, fields] = await db.execute(
            `UPDATE ${table} SET eventdetails = ?, stdname = ?, startDate = ?, endDate = ?, assigned = ?, completed = ?, approved = ?, status = ? WHERE id = ?`,
            [...values, id]
          );
               
        // Close the connection
        // await db.end();
    
        // Return the message of success
        if(rows && rows.changedRows) {
            return true;
        } else {
            return false;
        }
      } catch (error) {
        console.error(error);
      }
}