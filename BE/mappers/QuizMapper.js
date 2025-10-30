exports.toQuizDTO = (quiz) => {
      return {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        questions: quiz.questions.map(q => ({
            id: q.id,
            text: q.text,
            options: q.options,
            correctAnswerIndex: q.correctAnswerIndex,
            keyword: q.keyword || []
        }))
    };
};