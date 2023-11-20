const express = require('express');
const router = express.Router();
const ctrl = require('./controllers/loginctrl');
const tch = require('./controllers/teacherctrl');

// Route to insert student data
router.post('/loginteacher', ctrl.loginTeacher);
router.post('/loginadmin', ctrl.loginAdmin);
router.post('/loginstudent', ctrl.loginStudent)
router.get('/gettasks', tch.tasksInfo);
router.get('/getstds', tch.getStudents);
router.post('/add/student', tch.StudentAdd);
router.put('/edit/student', tch.editStudent);
router.delete('/delete/student', tch.deleteStudent);
router.get('/teachers', tch.getTeachers);
router.post('/add/teacher', tch.teacherAdd);
router.put('/edit/teacher', tch.editTeacher);
router.delete('/delete/teacher', tch.deleteTeacher);
router.post('/addevent', tch.addEvents);
router.get('/getcalenderEvents', tch.fetchEvents);
router.get('/getTeacherEvents', tch.fetchTeacherEvents);
router.get('/getStudentEvents', tch.fetchStdEvents)
router.put('/editevent', tch.editEvents);
router.delete('/deleteevent', tch.deleteEvents);
router.get('/allsupport', tch.allsupportFetch);
router.post('/add/support', tch.supportAdd);
router.put('/edit/support', tch.supportEdit);
router.delete('/delete/support', tch.supportDel)
router.get('/get/support', tch.supportFetch)
router.post('/addearnings', tch.addEarnings);
router.post('/getearnings', tch.getEarnings);
router.post('/add/demoevent', ctrl.demoEventAdd);
router.get('/get/demoevent', ctrl.fetchDemoEvents);
router.put('/edit/demoevent', ctrl.editDemoEvents);
router.delete('/delete/demoevent', ctrl.deleteDemoEvents);
router.get('/earnings', ctrl.fetchEarnings);
router.post('/add/pricings', ctrl.priceAdd);
router.get('/get/pricings', ctrl.getPrice);
router.get('/grades', tch.fetchGrades);
router.get('/allclasses', ctrl.allCls);
router.post('/add/curriculum', ctrl.addCurriculum);
router.get('/get/curriculum', ctrl.getCurriculumById);
router.get('/allcurriculum', ctrl.getAllCurriculum);
router.delete('/delete/curriculum', ctrl.deleteCurriculum);
router.put('/edit/curriculum', ctrl.editCurriculum);
router.post('/delete/allcurriculum', ctrl.deleteMulitpleCurriculum);
router.get('/hi', (req,res) => res.send("Hello Surya") );

module.exports = router;