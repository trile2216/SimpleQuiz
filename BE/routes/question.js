var express = require('express');
var router = express.Router();
var QuestionController = require('../controllers/QuestionController');
var { verifyUser, verifyAuthor } = require('../middleware/auth');

router.post("/", verifyUser, QuestionController.createQuestion);
router.get("/", QuestionController.getAllQuestions);
router.get("/:id", QuestionController.getQuestionById);
router.put("/:id", verifyUser, verifyAuthor, QuestionController.updateQuestion);
router.delete("/:id", verifyUser, verifyAuthor, QuestionController.deleteQuestion);

module.exports = router;
