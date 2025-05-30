const multer = require('multer')

const topicController = require('../apis/topic/topicController')
const studentController = require('../apis/student/studentController')
const mentorController = require('../apis/mentor/mentorController')
const discussionQuestionController = require('../apis/discussionQuestion/discussionQuestionController')
const discussionRepliesController = require('../apis/discussionReplies/discussionRepliesController')
const mentorshipProgramController = require('../apis/mentorshipProgram/mentorshipProgramController')
const dashboardController = require('../apis/dashboard/dashboardController')

const router = require("express").Router(); 

// Admin Token Checker
router.use(require('../middleware/AdminTokenChecker'))

// Topic Routes
const brandStorage = multer.memoryStorage()  
const brandUpload = multer({storage: brandStorage })
router.post('/topic/add', brandUpload.single("image") ,topicController.add)
router.post('/topic/update',brandUpload.single("image") ,topicController.update)
router.post('/topic/changeStatus',topicController.changeStatus)

// student Routes
router.post('/student/changeStatus',studentController.changeStatus)

//mentor Routes
router.post('/mentor/changeStatus',mentorController.changeStatus)

// Discussion Question Route
router.post('/discussionQuestion/changeStatus',discussionQuestionController.changeStatus)

// Discussion Reply Route
router.post('/discussionReplies/changeStatus', discussionRepliesController.changeStatus)

// Mentorship Program Route
router.post('/mentorshipProgram/changeStatus' , mentorshipProgramController.changeStatus)

// Dashboard Route
router.post('/dashboard/dashboard', dashboardController.dashboard)

module.exports = router;