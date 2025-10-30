const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Question = require('../models/Question');

async function verifyUser(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Truy cập bị từ chối' });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // load full user from DB (exclude password)
        const user = await User.findById(payload.id).select('-password');
        if (!user) return res.status(401).json({ message: 'Không tìm thấy người dùng' });
        req.user = user;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token không hợp lệ' });
    }
}

async function verifyAdmin(req, res, next) {
    if (req.user && req.user.admin) {
        return next();
    }
    return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này!' });
}


async function verifyAuthor(req, res, next) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Người dùng chưa xác thực' });
        }

        const questionId = req.params.id;
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Không tìm thấy câu hỏi' });
        }

        // compare ObjectIds
        if (!question.author || (question.author.toString() === req.user.id)) {
            return next();
        }

        return res.status(403).json({ message: 'Bạn không phải là tác giả của câu hỏi này' });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Lỗi máy chủ nội bộ' });
    }
}

module.exports = { verifyUser, verifyAdmin, verifyAuthor };