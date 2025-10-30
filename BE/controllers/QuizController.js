const Quiz = require('../models/Quiz.js');
const Question = require("../models/Question.js");
const { toQuizDTO } = require('../mappers/QuizMapper.js') ;

// Tạo mới quiz
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, questions } = req.body;

    if (questions != null)  {
        const createdQuestions = await Question.create(questions);
        const questionIds = createdQuestions.map(q => q.id);
        await Quiz.create({ title, description, questions: questionIds });
        return res.status(201).json({message: 'Tạo quiz và câu hỏi thành công'});
    }

    const questionIds = [];
    // Tạo quiz với danh sách ID câu hỏi
    await Quiz.create({ title, description, questions: questionIds });
    res.status(201).json({message: 'Tạo quiz thành công'});
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo quiz', error });
  }
};

exports.getAllQuizzes = async (req, res) => {
  try {
      const quizzes = await Quiz.find().populate('questions', 'text options keyword correctAnswerIndex');
      if (!quizzes || quizzes.length === 0) {
          return res.status(404).json({ message: 'Chưa có quiz nào' });
      }
      res.status(200).json(quizzes.map(toQuizDTO));
  } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách quiz', error });
  }  
};

exports.getQuizById = async (req, res) => {
  try {
      const quiz = await Quiz.findById(req.params.id).populate('questions', 'text options keyword correctAnswerIndex');
      if (!quiz) {
          return res.status(404).json({ message: 'Quiz không tồn tại' });
      }
      res.status(200).json(toQuizDTO(quiz));
  } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy quiz', error });
  }
};


exports.updateQuiz = async (req, res) => {
  try {
      const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('questions', 'text options keyword correctAnswerIndex');
      if (!quiz) {
          return res.status(404).json({ message: 'Quiz không tồn tại' });
      }           
      res.status(200).json(toQuizDTO(quiz));
  } catch (error) {       
      res.status(500).json({ message: 'Lỗi khi cập nhật quiz', error });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
      const quiz = await Quiz.findById(req.params.id).populate('questions', 'text options keyword correctAnswerIndex');
      if (!quiz) {
          return res.status(404).json({ message: 'Quiz không tồn tại' });
      }


      await Question.deleteMany({ id: { $in: quiz.questions } });
      await quiz.deleteOne();

      res.status(200).json({ message: 'Xóa quiz thành công' });
  } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa quiz', error });
  }   
};

exports.getQuizWithCapitalQuestions = async (req, res) => {
  try {
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId).populate({
      path: "questions",               
      match: { text: /capital/i },      
      select: "text options"           
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz không tồn tại" });
    }

    res.status(200).json(toQuizDTO(quiz));
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy quiz", error });
  }
};


exports.getQuizWithQuestions = async (req, res) => {
  try {
    const  quizId  = req.params.id;
    const word  = req.params.word;

    const regex = new RegExp(word, "i");

    const quiz = await Quiz.findById(quizId).populate({
      path: "questions",
      match: { text: regex }, 
      select: "text options"
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz không tồn tại" });
    }

    res.status(200).json(toQuizDTO(quiz));
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy quiz", error });
  }
};
    
exports.addQuestionToQuiz = async (req, res) => {
  try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
          return res.status(404).json({ message: 'Quiz không tồn tại' });
      }

      if(req.body.length > 1){
          return res.status(400).json({ message: 'Dữ liệu câu hỏi không hợp lệ. Vui lòng để thêm từng câu hỏi.' });
      }
      
      const question = new Question(req.body);
      await question.save();
      quiz.questions.push(question.id);
      await quiz.save();
      res.status(201).json({ message: 'Thêm câu hỏi vào quiz thành công'});
  } catch (error) {
      res.status(500).json({ message: 'Lỗi khi thêm câu hỏi vào quiz', error });
  }   
};

exports.addQuestionsToQuiz = async (req, res) => {
  try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
          return res.status(404).json({ message: 'Quiz không tồn tại' });
      }
      const questions = await Question.insertMany(req.body);
      const questionIds = questions.map(q => q.id);
      quiz.questions.push(...questionIds);
      await quiz.save();
      res.status(201).json({ message: 'Thêm câu hỏi vào quiz thành công'});
  } catch (error) {
      res.status(500).json({ message: 'Lỗi khi thêm câu hỏi vào quiz', error });
  }
};

exports.findQuizzesByTitle = async (req, res) => {
  try {
    const title = req.params.title || '';
    const regex = new RegExp(title, "i");
    const quizzes = await Quiz.find({ title: regex }).populate('questions', 'text options keyword');
    if (!quizzes || quizzes.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy quiz nào' });
    }
    res.status(200).json(quizzes.map(toQuizDTO));
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tìm kiếm quiz', error });
  }
};

exports.addExistingQuestionsToQuiz = async (req, res) => {
  try {
      const quiz = await Quiz.findById(req.params.id);
      if (!quiz) {
          return res.status(404).json({ message: 'Quiz không tồn tại' });
      }
      const { questionIds } = req.body;
      if (!Array.isArray(questionIds) || questionIds.length === 0) {
          return res.status(400).json({ message: 'Dữ liệu câu hỏi không hợp lệ' });
      }
      const validQuestions = await Question.find({ id: { $in: questionIds } });
      if (validQuestions.length === 0) {
          return res.status(400).json({ message: 'Không có câu hỏi hợp lệ để thêm' });
      } 
      const validQuestionIds = validQuestions.map(q => q.id);
      quiz.questions.push(...validQuestionIds);
      await quiz.save();
      res.status(200).json({ message: 'Thêm câu hỏi hiện có vào quiz thành công' });
  }catch (error) {
      res.status(500).json({ message: 'Lỗi khi thêm câu hỏi vào quiz', error });
  }
};
