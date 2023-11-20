const loginService = require('../services/loginservice');
const teacherService = require('../services/teacherservice');
const genericService = require('../services/genericService');

const db = require('../db');

module.exports.loginTeacher = async (req, res) => {
    const { username, password } = req.body;
    const success = await loginService.logTeacher('teacher', username, password);
    return res.send(success);
};

module.exports.loginAdmin = async (req, res) => {
    const { username, password } = req.body;
    const success = await loginService.logAdmin('admin', username, password);
    return res.send(success);
};

module.exports.loginStudent = async (req, res) => {
    const { username, password } = req.body;
    const success = await loginService.logStudent('student', username, password);
    return res.send(success);
};

module.exports.demoEventAdd = async (req, res) => {
    let data = req.body;
    if(data.approved && data.completed) {
        data.status = "approved";
    }
    const added = await teacherService.postRecords('demo_events', data);
    return res.send(added);
};

module.exports.fetchDemoEvents = async (req, res) => {
    const id = parseInt(req.query.id); // Use req.query.id to get the id from the query parameters
    const getEvents = await loginService.getData('demo_events');
    return res.send(getEvents);
};

module.exports.editDemoEvents = async (req, res) => {
    const updated = await loginService.eventDemoEdit('demo_events', req.body);
    return res.send(updated);
};

module.exports.deleteDemoEvents = async (req, res) => {
    const id = parseInt(req.query.id);
    const deleted = await teacherService.deleteRowId('demo_events', id);
    return res.send(deleted);
}


module.exports.fetchEarnings = async (req, res) => {
    const id = parseInt(req.query.id);
    const earnings = await loginService.getEarnings(id);
    return res.send(earnings);
}

module.exports.priceAdd = async (req, res) => {
    const priceDelete= await db.execute(`DELETE FROM pricings`);
    const added = await teacherService.postRecords('pricings', req.body);
    return res.send(added);
};

module.exports.getPrice = async(req,res) => {
    const prices = await loginService.getData('pricings');
    return res.send(prices);
}

module.exports.allCls = async (req, res) => {
    const [rows]= await db.execute('SELECT SUM(CAST(num_classes AS SIGNED)) as total_classes FROM student');
    const totalClasses = rows[0]['total_classes'];
    console.log(totalClasses);
     return res.send(totalClasses);
};

module.exports.addCurriculum = async (req,res) => {
    const added = await teacherService.postMultipleRecords('curriculum', req.body);
    return res.send(added);
};


module.exports.getCurriculumById = async (req,res) => {
    let obj = {
        grade_id: parseFloat(req.query.grade_id),
        id: parseFloat(req.query.id)
    }
    const data = await genericService.getDataByKeys('curriculum', obj);
    return res.send(data);
}

module.exports.getAllCurriculum = async (req,res) => {
    const data = await loginService.getData('curriculum');
    return res.send(data);
}

module.exports.deleteCurriculum = async (req, res) => {
    const id = parseInt(req.query.id);
    const deleted = await teacherService.deleteRowId('curriculum', id);
    return res.send(deleted);
}

module.exports.deleteMulitpleCurriculum = async (req, res) => {
    const ids = req.body
    const deleted = await genericService.deleteRecords('curriculum', ids);
    return res.send(deleted);
}

module.exports.editCurriculum = async (req, res) => {
    let arr = req.body;
    const updated = await genericService.updateMultipleRec('curriculum', arr);
    return res.send(updated);
}

