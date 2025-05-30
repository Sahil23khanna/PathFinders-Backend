const multer = require('multer')

const mentorController = require('../apis/mentor/mentorController')
const storyController = require('../apis/story/storyController')
const mentorshipProgramController = require('../apis/mentorshipProgram/mentorshipProgramController')
const enrollmentController = require('../apis/enrollment/enrollmentController')
const discussionQuestionController = require('../apis/discussionQuestion/discussionQuestionController')
const mentordashboardController = require('../apis/dashboard/mentordashboardController')
const discussionRepliesController = require('../apis/discussionReplies/discussionRepliesController')

const router = require("express").Router(); 


// Mentor Token Checker
router.use(require('../middleware/MentorTokenChecker'))

// Mentor Routes
const brandStorage = multer.memoryStorage()  
const brandUpload = multer({storage: brandStorage })
router.post('/mentor/update', brandUpload.single("profile") ,mentorController.update)

//Story Routes
router.post('/story/add',storyController.add)
router.post('/story/changeStatus', storyController.changeStatus)
router.post('/story/update',storyController.update)

// Mentorship Program Routes
router.post('/mentorshipProgram/add', mentorshipProgramController.add)
router.post('/mentorshipProgram/update' , mentorshipProgramController.update)
router.post('/mentorshipProgram/changestatus', mentorshipProgramController.changeStatus)

// Enrollment Routes
router.post('/enrollment/update', enrollmentController.update)
router.post('/enrollment/changeStatus' , enrollmentController.changeStatus)

// Discussion Question Routes
router.post('/discussionQuestion/add' , discussionQuestionController.add)
router.post('/discussionQuestion/update', discussionQuestionController.update)
router.post('/discussionQuestion/changeStatus' , discussionQuestionController.changeStatus)

// Discussion Reply Routes
router.post('/discussionReplies/add', discussionRepliesController.add)
router.post('/discussionReplies/update', discussionRepliesController.update)

// dashboard route
router.post('/dashboard/mentordashboard', mentordashboardController.Mentordashboard)


module.exports = router;