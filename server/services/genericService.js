const db = require('../db');

module.exports.getDataByKeys = async (table, keyValuePairs) => {
    const keys = Object.keys(keyValuePairs);
    const values = Object.values(keyValuePairs);

    // Constructing the WHERE clause dynamically
    const whereClause = keys.map(key => `${key} = ?`).join(' AND ');

    const [data] = await db.execute(`SELECT * FROM ${table} WHERE ${whereClause}`, values)
        .catch(err => err);

    if(data && data.length) {
        return data;
    }

    return null;
}


module.exports.updateRecordByKeys = async (table, data, keyValuePairs) => {
    try {
        const setClause = Object.keys(data)
            .map(column => `${column} = ?`)
            .join(', ');

        const whereClause = Object.keys(keyValuePairs)
            .map(key => `${key} = ?`)
            .join(' AND ');

        const values = [...Object.values(data), ...Object.values(keyValuePairs)]; // Include both data and key-value pairs

        const [rows] = await db.execute(
            `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`,
            values
        );

        if (rows && rows.affectedRows > 0) {
            return true;
        }
    } catch (error) {
        console.error(error);
    }
};



module.exports.updateMultipleRec = async (tableName, dataArray) => {
    try {
        for (const data of dataArray) {
          const id = data.id;
    
          if (id) {
            const setClause = Object.keys(data)
            .map(key => `${key} = ?`)
            .join(', ');
    
            const values = Object.values(data).filter(value => value !== undefined);
    
            const [rows] = await db.execute(
              `UPDATE ${tableName} SET ${setClause} WHERE id = ?`,
              [...values, id]
            );
    
            if (rows && rows.affectedRows > 0) {
            //   console.log(`Record with id ${id} updated successfully`);
            }
          } else {
            const columns = Object.keys(data).join(', ');
            const valuePlaceholders = Object.keys(data).map(() => '?').join(', ');
    
            const values = Object.values(data).filter(value => value !== undefined);
    
            const [rows] = await db.execute(
              `INSERT INTO ${tableName} (${columns}) VALUES (${valuePlaceholders})`,
              values
            );
    
            if (rows && rows.insertId) {
            //   console.log(`New record inserted with id ${rows.insertId}`);
            }
          }
        }
    
        return true;
      } catch (error) {
        console.error('Error updating data:', error);
        return false;
      }
};



module.exports.deleteRecords = async (table, ids) => {
    try {
        const placeholders = ids.map(() => '?').join(', ');
        const [rows] = await db.execute(`DELETE FROM ${table} WHERE id IN (${placeholders})`, ids);

        if (rows && rows.affectedRows > 0) {
            return true;
        }
    } catch (error) {
        console.error(error);
    }
};





  