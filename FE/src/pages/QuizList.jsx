import React, { useEffect, useState, useContext } from "react";
import axiosClient from "../api/axiosClient";
import { Button, Card, Table, Modal, Form, Container } from "react-bootstrap";
import { PlusOutlined, DeleteOutlined, EyeOutlined, PlusCircleOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function QuizList() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddQ, setShowAddQ] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editForm, setEditForm] = useState({ title: "", description: "" });
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const fetchQuizzes = async () => {
    const res = await axiosClient.get("/quizzes");
    setQuizzes(res.data);
  };

  const fetchQuestions = async () => {
    const res = await axiosClient.get("/questions");
    setQuestions(res.data);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await axiosClient.post("/quizzes", form);
    fetchQuizzes();
    setShowModal(false);
    setForm({ title: "", description: "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this quiz?")) {
      await axiosClient.delete(`/quizzes/${id}`);
      fetchQuizzes();
    }
  };

  const handleAddQuestions = async () => {
    await axiosClient.post(`/quizzes/${selectedQuiz}/questions`, {
      questionIds: selectedQuestions,
    });
    fetchQuizzes();
    setShowAddQ(false);
    setSelectedQuestions([]);
  };

  const handleOpenEdit = (quiz) => {
    setEditingQuizId(quiz.id);
    setEditForm({ title: quiz.title, description: quiz.description });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put(`/quizzes/${editingQuizId}`, editForm);
      fetchQuizzes();
      setShowEditModal(false);
      setEditForm({ title: "", description: "" });
      setEditingQuizId(null);
    } catch (err) {
      console.error("Error updating quiz:", err);
      alert(err.normalized?.message || "Failed to update quiz");
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Quizzes</h3>
        {user && user.admin && (
          <Button onClick={() => setShowModal(true)} variant="primary">
            <PlusOutlined /> New Quiz
          </Button>
        )}
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Questions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((q) => (
            <tr key={q.id}>
              <td>{q.title}</td>
              <td>{q.description}</td>
              <td>{q.questions?.length || 0}</td>
              <td>
                <Button
                  size="sm"
                  variant="info"
                  className="me-2"
                  onClick={() => navigate(`/quiz/${q.id}`)}
                >
                  <EyeOutlined /> 
                </Button>
                {user && user.admin && (
                  <>
                    <Button
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        fetchQuestions();
                        setSelectedQuiz(q.id);
                        setShowAddQ(true);
                      }}
                    >
                      <PlusCircleOutlined />
                    </Button>
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                      onClick={() => handleOpenEdit(q)}
                    >
                      <EditOutlined />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(q.id)}
                    >
                      <DeleteOutlined />
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal tạo quiz */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </Form.Group>
            <Button type="submit" className="mt-3 w-100">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal thêm câu hỏi */}
      <Modal show={showAddQ} onHide={() => setShowAddQ(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Questions to Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {questions.map((q) => (
              <Form.Check
                key={q.id}
                type="checkbox"
                label={q.text}
                onChange={(e) => {
                  if (e.target.checked)
                    setSelectedQuestions([...selectedQuestions, q._id]);
                  else
                    setSelectedQuestions(
                      selectedQuestions.filter((id) => id !== q.id)
                    );
                }}
              />
            ))}
          </Form>
          <Button className="mt-3" onClick={handleAddQuestions}>
            Add Selected
          </Button>
        </Modal.Body>
      </Modal>

      {/* Modal edit quiz */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveEdit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </Form.Group>
            <Button type="submit" variant="warning" className="mt-3 w-100">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
