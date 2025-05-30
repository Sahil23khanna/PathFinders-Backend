const multer = require('multer')
const studentController = require('../apis/student/studentController')
const enrollmentController = require('../apis/enrollment/enrollmentController')
const discussionRepliesController = require('../apis/discussionReplies/discussionRepliesController')
const feedbackController = require('../apis/feedback/feedbackController')
const discussionQuestionController = require('../apis/discussionQuestion/discussionQuestionController')

const router = require("express").Router(); 

// Student Token Checker
router.use(require('../middleware/StudentTokenChecker'))

// Student Routes
const brandStorage = multer.memoryStorage()  
const brandUpload = multer({storage: brandStorage })
router.post('/student/update', brandUpload.single("profile"),studentController.update)

// Enrollment Routes
router.post('/enrollment/add' , enrollmentController.add)
router.post('/enrollment/add1', enrollmentController.add1)


// Discussion Replies Routes
router.post('/discussionReplies/add' , discussionRepliesController.add)
router.post('/discussionReplies/update' , discussionRepliesController.update)

// Discussion Question Controller
router.post('/discussionQuestion/add',discussionQuestionController.add)
router.post('/discussionQuestion/update',discussionQuestionController.update)

// feedback controller
router.post('/feedback/add',feedbackController.add)
router.post('/feedback/delete' , feedbackController.deletefeedback)

module.exports = router;