const topicController = require('../apis/topic/topicController')
const userController = require('../apis/user/userController')
const studentController = require('../apis/student/studentController')
const mentorController = require('../apis/mentor/mentorController')
const storyController = require("../apis/story/storyController")
const mentorshipProgramController = require('../apis/mentorshipProgram/mentorshipProgramController')
const enrollmentController = require('../apis/enrollment/enrollmentController')
const discussionQuestionController = require('../apis/discussionQuestion/discussionQuestionController')
const discussionRepliesController = require('../apis/discussionReplies/discussionRepliesController')
const feedbackController = require('../apis/feedback/feedbackController')

const router = require("express").Router(); 

// Authentication Routes
router.post('/user/login',userController.login)
router.post('/student/register',studentController.register)
router.post('/mentor/register',mentorController.register)

// Topic Routes
router.post('/topic/all' , topicController.all)
router.post('/topic/single', topicController.single)

// Student Routes
router.post('/student/all', studentController.all)
router.post('/student/single',studentController.single)

// mentor Routes
router.post('/mentor/all',mentorController.all)
router.post('/mentor/single',mentorController.single)

// Story Routes
router.post('/story/all', storyController.all)
router.post('/story/single' , storyController.single)

// Mentorship Program Routes
router.post('/mentorshipProgram/all' , mentorshipProgramController.all)
router.post('/mentorshipProgram/single' , mentorshipProgramController.single)



// General token checker
router.use(require('../middleware/TokenChecker'))

// change password for user
router.post('/user/change/password',userController.changePassword)


// Enrollment Routes
router.post('/enrollment/all' , enrollmentController.all)
router.post('/enrollment/single',enrollmentController.single)


// Discussion Question Routes
router.post('/discussionQuestion/all' , discussionQuestionController.all)
router.post('/discussionQuestion/single', discussionQuestionController.single)


// Discussion Reply Routes
router.post('/discussionReplies/all', discussionRepliesController.all)
router.post('/discussionReplies/add', discussionRepliesController.add)
router.post('/discussionReplies/single',discussionRepliesController.single)

// feedback Routes
router.post('/feedback/all',feedbackController.all)
router.post('/feedback/single' , feedbackController.single)

module.exports = router;