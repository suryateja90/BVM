const mysql = require('mysql2/promise');
const pool = require('../db');
const teacherService = require('../services/teacherservice');

// const pool = mysql.createPool(config.database);

const createTableQueries = require('../schema/schema');

async function createTables() {
  for (const query of createTableQueries) {
    await pool.execute(query);
  }
}


async function setGradeData() {
  try {
    const results = await pool.execute('SELECT COUNT(*) as count FROM grades');

    if (results[0][0].count > 0) {
     
    } else {
      await insertGradeData();
    }
  } catch (error) {
    console.error('Error checking default data: ' + error);
  } 
}

async function insertGradeData() {
  const defaultData =[
    { grade: 'Grade (1-2)' },
    { grade: 'Grade (3-5)' },
    { grade: 'Grade (6-8)' },
    { grade: 'Grade (9-12)' }
    // Add more default data objects as needed
  ];
  const added = await teacherService.postMultipleRecords('grades', defaultData);
}

module.exports = {
  createTables,
  setGradeData
};
