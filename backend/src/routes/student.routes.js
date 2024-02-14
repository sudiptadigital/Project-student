const express = require('express');
const studentController = require('../controllers/student.controller')
const router = express.Router();



router.route('/').get(
    studentController.getStudentController
)
router.route('/').post(
    studentController.saveStudentDetails
)
router.route('/:email').put(
    studentController.updateStudentController
)
router.route('/:email').delete(
    studentController.deleteStudentController
)
module.exports = router;