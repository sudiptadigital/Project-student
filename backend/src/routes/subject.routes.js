const express = require('express');
const subjectController = require('../controllers/subject.controller')
const router = express.Router();



router.route('/').get(
    subjectController.getSubjectController
)
router.route('/').post(
    subjectController.saveSubjectController
)
module.exports = router;