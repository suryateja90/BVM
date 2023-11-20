const db = require('../db');
module.exports.getTasks = async (table, id) => {
    const [data] = await db.execute(`SELECT * FROM ${table} WHERE teacher_id = ?`, [id])
        .catch(err => err);
    if(data && data.length) {
        return data;
    }
    return null;
}

module.exports.getCalenderEvents = async (table, id) => {
    const [data] = await db.execute(`SELECT * FROM ${table} WHERE teacher_id = ?`, [id])
        .catch(err => err);
    if(data && data.length) {
        return data;
    }
    return null;
}

module.exports.getTeacherEvents = async (table) => {
  const [data] = await db.execute(`SELECT * FROM ${table}`)
      .catch(err => err);
  if(data && data.length) {
      return data;
  }
  return null;
}

module.exports.fetchAll = async (table) => {
  const [data] = await db.execute(`SELECT * FROM ${table}`)
      .catch(err => err);
  if(data && data.length) {
      return data;
  }
  return null;
}

module.exports.stdsFetch = async () => {
    const [data] = await db.execute(`SELECT * FROM student`)
    .catch(err => err);
    if(data && data.length) {
        return data;
    }
    return null;
} 

module.exports.tchFetch = async () => {
    const [data] = await db.execute(`SELECT * FROM teacher`)
    .catch(err => err);
    if(data && data.length) {
        return data;
    }
    return null;
} 

module.exports.eventAdd = async (table,paramObj) => {
    try {
        // Insert the data into the events table
        const values = [
            paramObj.title || null,
            paramObj.eventdetails || null,
            paramObj.class || null,
            paramObj.start_date || null,
            paramObj.end_date || null,
            paramObj.teacher_id || null,
            paramObj.student_id || null,
            paramObj.tch_mail || null,
            paramObj.assigned || false,  // Assuming 'assigned' is a boolean field
            paramObj.completed || false, // Assuming 'completed' is a boolean field
            paramObj.approved || false,  // Assuming 'approved' is a boolean field
            paramObj.status || null
          ];
          
          const [rows] = await db.execute(
            `INSERT INTO ${table} (title, eventdetails, class, start_date, end_date, teacher_id, student_id, tch_mail, assigned, completed, approved, status) VALUES (?,?,?,?,?, ?, ?, ?, ?, ?, ?, ?)`,
            values
          );
    
        // Close the connection
        // await db.end();
    
        // Return the message of success
        if(rows && rows.insertId) {
            return true;
        }
      } catch (error) {
        console.error(error);
      }
}

module.exports.eventEdit = async (table,paramObj) => {
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
      if(!paramObj.completed && !paramObj.approved) {
        paramObj.status = 'assigned'
      }
        
        const values = [
          paramObj.title || null,
          paramObj.eventdetails || null,
          paramObj.class || null,
          paramObj.start_date || null,
          paramObj.end_date || null,
          paramObj.student_id || null,
          paramObj.tch_mail || null,
          paramObj.assigned || false,  
          paramObj.completed || false, 
          paramObj.approved || false, 
          paramObj.status || null,
          id,
        ];
        
        const [rows, fields] = await db.execute(
            `UPDATE ${table} SET title = ?, eventdetails = ?, class = ?, start_date = ?, end_date = ?, student_id = ?, tch_mail = ?,assigned = ?, completed = ?, approved = ?, status = ? WHERE id = ?`,
            values
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

module.exports.deleteRowId = async (table,id) => {
    try {
        const [rows] = await db.execute(`DELETE FROM ${table} WHERE id = ?`, [id]);
        return rows.affectedRows > 0; // Returns true if a row was deleted
    } catch (error) {
        throw error;
    }

}

module.exports.postRecords =  async (table,paramObj) => {
    try {
        const columns = Object.keys(paramObj).join(', ');
        const values = Object.values(paramObj).map(value => value || null);
    
        const [rows] = await db.execute(
          `INSERT INTO ${table} (${columns}) VALUES (${values.map(() => '?').join(', ')})`,
          values
        );
    
        if (rows && rows.insertId) {
          return true;
        }
      } catch (error) {
        console.error(error);
      }
}

module.exports.postMultipleRecords = async (table,paramObj) => {
  try {
    const columns = Object.keys(paramObj[0]).join(', '); // Assuming all objects have the same structure
    const values = paramObj.map(obj => Object.values(obj).map(value => value || null));

    const placeholders = values[0].map(() => '?').join(', ');
    const valuePlaceholders = values.map(() => `(${placeholders})`).join(', ');

    const flatValues = values.flat();

    const [rows] = await db.execute(
        `INSERT INTO ${table} (${columns}) VALUES ${valuePlaceholders}`,
        flatValues
    );

    if (rows && rows.insertId) {
        return true;
    }
} catch (error) {
    console.error(error);
}
}


module.exports.updateRecord = async (table, paramObj, recordId) => {
  try {
    const setClause = Object.keys(paramObj)
      .map(column => `${column} = ?`)
      .join(', ');
    const values = Object.values(paramObj).map(value => value || null);
    values.push(recordId);

    const [rows] = await db.execute(
      `UPDATE ${table} SET ${setClause} WHERE id = ?`,
      values
    );

    if (rows && rows.affectedRows > 0) {
      return true;
    }
  } catch (error) {
    console.error(error);
  }
};


module.exports.earningsFetch = async (table, info) => {
    const { teacher_id, month_name } = info;
    const [data] = await db.execute(
        `SELECT * FROM ${table} WHERE teacher_id = ? AND month_name = ?`,
        [teacher_id, month_name]
    ).catch(err => err);

    if(data && data.length) {
        return data;
    }
    return null;
}
