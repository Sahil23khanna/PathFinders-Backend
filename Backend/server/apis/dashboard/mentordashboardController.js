const mentorshipProgramModel = require("../../apis/mentorshipProgram/mentorshipProgramModel")
const discussionQuestionModel = require("../../apis/discussionQuestion/discussionQuestionModel")
const discussionRepliesModel = require("../../apis/discussionReplies/discussionRepliesModel")

const Mentordashboard = async (req, res) => {
  try {
    const mentorId = req.decoded.userId;

    const totalmentorshipProgram = await mentorshipProgramModel.countDocuments({ mentor: mentorId }).exec();
    const totaldiscussionQuestion = await discussionQuestionModel.countDocuments({ addedById: mentorId }).exec();
    const totaldiscussionReplies = await discussionRepliesModel.countDocuments({addedById:mentorId}).exec();
    
    res.json({
      status: 200,
      success: true,
      message: "dashboard data fetched successfully",
      totalmentorshipProgram,
      totaldiscussionQuestion,
      totaldiscussionReplies
     
    });
  } catch (err) {
    res.json({
      status: 500,
      success: false,
      message: "internal server error"
    });
  }
};

module.exports = { Mentordashboard };