const Question = require("../models/Question.js");
const { toQuestionDTO } = require("../mappers/QuestionMapper.js");

exports.createQuestion = async (req, res) => {
    try {
        const userId = req.user.id;
        const payload = { ...req.body, author: userId };
        await Question.create(payload);
        res.status(201).json({message: 'Tạo câu hỏi thành công'});
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo câu hỏi', error });
    }
};

exports.getAllQuestions = async (req, res) => {
    try{
        const questions = await Question.find();
        if (!questions || questions.length === 0) {
            return res.status(404).json({ message: 'Chưa có câu hỏi nào' });
        }
        res.status(200).json(questions.map(toQuestionDTO));
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách câu hỏi', error });
    }
};

exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Câu hỏi không tồn tại' });
        }
        res.status(200).json(toQuestionDTO(question));
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy câu hỏi', error });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const userId = req.user.id;
        const existingQuestion = await Question.findById(req.params.id);
        if (!existingQuestion) {
            return res.status(404).json({ message: 'Câu hỏi không tồn tại' });
        }

        if (existingQuestion.author.toString() !== userId) {
            return res.status(403).json({ message: 'Bạn không phải là tác giả của câu hỏi này' });
        }

        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(toQuestionDTO(updatedQuestion));
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật câu hỏi', error });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const userId = req.user.id;
        const existingQuestion = await Question.findById(req.params.id);

        if (!existingQuestion) {
            return res.status(404).json({ message: 'Câu hỏi không tồn tại' });
        }

        if (existingQuestion.author.toString() !== userId) {
            return res.status(403).json({ message: 'Bạn không phải là tác giả của câu hỏi này' });
        }

        await Question.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Xóa câu hỏi thành công' });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa câu hỏi', error });
    }
};

