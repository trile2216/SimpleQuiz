import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { Container, Card, Button, Badge } from "react-bootstrap";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function QuizDetail() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axiosClient.get(`/quizzes/${quizId}`);
        setQuiz(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchQuiz();
  }, [quizId]);

  if (!quiz) return <Container className="mt-4"><p>Loading...</p></Container>;

  return (
    <Container className="mt-4">
      <Button 
        variant="outline-secondary" 
        size="sm" 
        className="mb-3"
        onClick={() => navigate("/")}
      >
        <ArrowLeftOutlined /> Back to Quizzes
      </Button>

      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <h3>{quiz.title}</h3>
          <p className="mb-0">{quiz.description}</p>
        </Card.Header>
        <Card.Body>
          <p className="text-muted mb-0">
            <strong>Total Questions:</strong> {quiz.questions?.length || 0}
          </p>
        </Card.Body>
      </Card>

      <h5 className="mb-3">Questions List</h5>
      {quiz.questions && quiz.questions.length > 0 ? (
        quiz.questions.map((question, qIdx) => (
          <Card key={question._id} className="mb-3 shadow-sm">
            <Card.Body>
              <h6 className="mb-3">
                <Badge bg="secondary" className="me-2">#{qIdx + 1}</Badge>
                {question.text}
              </h6>
              
              <div className="ms-4">
                <p className="mb-2"><strong>Options:</strong></p>
                <ul className="list-unstyled">
                  {question.options.map((option, optIdx) => (
                    <li key={optIdx} className="mb-1">
                      <Badge 
                        bg={question.correctAnswerIndex === optIdx ? "success" : "light"} 
                        text={question.correctAnswerIndex === optIdx ? "white" : "dark"}
                        className="me-2"
                      >
                        {optIdx === question.correctAnswerIndex ? "✓" : String.fromCharCode(65 + optIdx)}
                      </Badge>
                      {option}
                    </li>
                  ))}
                </ul>
                
                <p className="mb-1">
                  <strong>Correct Answer:</strong>{" "}
                  <Badge bg="success">
                    {question.options[question.correctAnswerIndex]}
                  </Badge>
                </p>

                {question.keywords && question.keywords.length > 0 && (
                  <p className="mb-0 text-muted">
                    <small><strong>Keywords:</strong> {question.keywords.join(", ")}</small>
                  </p>
                )}
              </div>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Card className="shadow-sm">
          <Card.Body className="text-center text-muted">
            No questions in this quiz yet.
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
