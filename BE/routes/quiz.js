var express = require('express');
var router = express.Router();
var QuizController = require('../controllers/QuizController');
const {verifyAdmin, verifyUser } = require('../middleware/auth');

router.post("/", verifyUser, verifyAdmin, QuizController.createQuiz);
router.get("/", QuizController.getAllQuizzes);        
router.get("/:id", QuizController.getQuizById);     
router.get("/:id/populate", QuizController.getQuizWithCapitalQuestions);
router.get("/:id/populate/:word", QuizController.getQuizWithQuestions);
router.put("/:id", verifyUser, verifyAdmin, QuizController.updateQuiz);
router.delete("/:id", verifyUser, verifyAdmin, QuizController.deleteQuiz);
router.post("/:id/questions", verifyUser, verifyAdmin, QuizController.addQuestionsToQuiz);
module.exports = router;