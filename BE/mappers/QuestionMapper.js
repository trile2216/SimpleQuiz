exports.toQuestionDTO = (question) => { 
    return {
        id: question.id,
        text: question.text,
        options: question.options,
        correctAnswerIndex: question.correctAnswerIndex,
        keyword: question.keyword || [],
        author: {
            id: question.author.id  ,
            username: question.author.username
        }
    };  
};