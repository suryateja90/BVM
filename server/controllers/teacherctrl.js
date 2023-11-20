const teacherService = require('../services/teacherservice');
const genericService = require('../services/genericService');

module.exports.tasksInfo = async (req, res) => {
    const id = req.query.id; // Use req.query.id to get the id from the query parameters
    const getTasks = await teacherService.getTasks('tasks', id);
    return res.send(getTasks);
};

module.exports.getStudents = async(req,res) => {
    const stds = await teacherService.stdsFetch();
    return res.send(stds);
};

module.exports.StudentAdd = async (req, res) => {
    let obj = req.body;
    obj.role = 'Student';
    obj.token = 'Student';
    obj.name = obj.firstName + ''+obj.lastName;
    delete obj.id;
    const added = await teacherService.postRecords('student', obj);
    return res.send(added);
}


module.exports.editStudent = async (req, res) => {
    let obj = req.body;
    obj.role = 'Student';
    obj.token = 'Student';
    const added = await teacherService.updateRecord('student', obj, obj.id);
    return res.send(added);
};

module.exports.deleteStudent = async (req, res) => {
    const id = parseInt(req.query.id);
    const deleted = await teacherService.deleteRowId('student', id);
    return res.send(deleted);
};


module.exports.teacherAdd = async (req, res) => {
    let obj = req.body;
    obj.role = 'Teacher';
    obj.token = 'Teacher';
    obj.name = `${obj.firstName} ${obj.lastName}`
    const added = await teacherService.postRecords('teacher', obj);
    return res.send(added);
}


module.exports.editTeacher = async (req, res) => {
    let obj = req.body;
    obj.role = 'Teacher';
    obj.token = 'Teacher';
    const added = await teacherService.updateRecord('teacher', obj, obj.id);
    return res.send(added);
};

module.exports.getTeachers = async(req,res) => {
    const stds = await teacherService.tchFetch();
    return res.send(stds);
};

module.exports.deleteTeacher = async (req, res) => {
    const id = parseInt(req.query.id);
    const deleted = await teacherService.deleteRowId('teacher', id);
    return res.send(deleted);
};

module.exports.addEvents = async(req,res) => {
    const added = await teacherService.eventAdd('events', req.body);
    return res.send(added);
};

module.exports.fetchEvents = async (req, res) => {
    const id = parseInt(req.query.id); // Use req.query.id to get the id from the query parameters
    const getEvents = await teacherService.getCalenderEvents('events', id);
    return res.send(getEvents);
};

module.exports.fetchTeacherEvents = async (req, res) => {
    const getEvents = await teacherService.getTeacherEvents('events');
    return res.send(getEvents);
};

module.exports.editEvents = async (req, res) => {
    const updated = await teacherService.eventEdit('events', req.body);
    return res.send(updated);
};

module.exports.deleteEvents = async (req, res) => {
    const id = parseInt(req.query.id);
    const deleted = await teacherService.deleteRowId('events', id);
    return res.send(deleted);
};


module.exports.fetchStdEvents = async (req, res) => {
    let obj = {
        student_id: parseFloat(req.query.id),
    }
    const stdClasses = await genericService.getDataByKeys('events', obj);
    return res.send(stdClasses);
};

module.exports.supportAdd = async (req, res) => {
    const added = await teacherService.postRecords('support', req.body);
    return res.send(added);
}

module.exports.supportEdit = async (req, res) => {
    let obj = req.body;
    let qValues = req.query.id;
    const updated = await teacherService.updateRecord('support', obj, qValues);
    return res.send(updated);
}

module.exports.supportDel = async (req, res) => {
    const id = parseInt(req.query.id);
    const deleted = await teacherService.deleteRowId('support', id);
    return res.send(deleted);
};

module.exports.supportFetch = async (req, res) => {
    let obj = {
        raiseby_id: parseFloat(req.query.id),
        role: req.query.role
    }
    const support = await genericService.getDataByKeys('support', obj);
    return res.send(support);
};

module.exports.allsupportFetch = async (req, res) => {
    let obj = {
        raiseby_id: parseFloat(req.query.id),
        role: req.query.role
    }
    const support = await teacherService.fetchAll('support');
    return res.send(support);
};

module.exports.addEarnings = async (req, res) => {

    const added = await teacherService.postRecords('earnings', req.body);
    return res.send(added);
}

module.exports.getEarnings = async(req,res) => {
    const added = await teacherService.earningsFetch('earnings', req.body);
    return res.send(added);
};


module.exports.fetchGrades = async (req, res) => {
    const getEvents = await teacherService.getTeacherEvents('grades');
    return res.send(getEvents);
};