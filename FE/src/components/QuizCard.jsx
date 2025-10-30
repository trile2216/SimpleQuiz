import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PlayCircleOutlined } from "@ant-design/icons";

export default function QuizCard({ quiz }) {
  const navigate = useNavigate();

  return (
    <Card className="shadow-sm h-100">
      <Card.Body className="d-flex flex-column">
        <Card.Title>{quiz.title}</Card.Title>
        <Card.Text className="flex-grow-1">{quiz.description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            {quiz.questions?.length || 0} questions
          </small>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => navigate(`/quiz/${quiz.id}`)}
          >
            <PlayCircleOutlined /> Start
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
