const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({ 
    title: { type: String, required: true },
    description: String,
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
    }]
});

module.exports = mongoose.model('Quiz', quizSchema);