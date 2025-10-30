const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: { type: String },
    options: { type: [String] },
    keyword: { type: [String] },
    correctAnswerIndex: {
      type: Number,
    },
    author: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
