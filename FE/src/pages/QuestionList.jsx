import React, { useEffect, useState, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import {
  Button,
  Form,
  Table,
  Modal,
  Container,
  Row,
  Col,
  Alert,
} from 'react-bootstrap';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { AuthContext } from '../context/AuthContext';

export default function QuestionList() {
  const { user } = useContext(AuthContext);
  const [myQuestions, setMyQuestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    keywords: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const fetchQuestions = async () => {
    try {
      const res = await axiosClient.get('/questions');
      
      if (user && !user.admin) {
        const filtered = res.data.filter(q => q.author === user._id);
        setMyQuestions(filtered);
      } else {
        setMyQuestions(res.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load questions');
    }
  };

  useEffect(() => {
    if (user) {
      fetchQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      keywords: form.keywords.split(',').map((k) => k.trim()).filter(k => k),
    };

    try {
      if (editingId) {
        await axiosClient.put(`/questions/${editingId}`, payload);
      } else {
        await axiosClient.post('/questions', payload);
      }
      fetchQuestions();
      handleClose();
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save question');
    }
  };

  const handleEdit = (q) => {
    if (!user.admin && q.author !== user._id) {
      setError('You can only edit your own questions!');
      return;
    }
    
    setForm({
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      keywords: q.keywords?.join(', ') || '',
    });
    setEditingId(q._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const question = myQuestions.find(q => q._id === id);
    if (!user.admin && question?.author !== user._id) {
      setError('You can only delete your own questions!');
      return;
    }

    if (window.confirm('Delete this question?')) {
      try {
        await axiosClient.delete(`/questions/${id}`);
        fetchQuestions();
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete question.');
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ text: '', options: ['', '', '', ''], correctAnswerIndex: 0, keywords: '' });
  };

  const canEditDelete = (question) => {
    return user.admin || question.author === user._id;
  };

  return (
    <Container className='mt-4'>
      <Row>
        <Col className='d-flex justify-content-between align-items-center mb-3'>
          <div>
            <h3>{user.admin ? 'All Questions (Admin)' : 'My Questions'}</h3>
            <small className='text-muted'>
              {user.admin 
                ? `Total: ${myQuestions.length} questions` 
                : `You have ${myQuestions.length} questions`}
            </small>
          </div>
          <Button onClick={() => setShowModal(true)} variant='primary'>
            <PlusOutlined /> New Question
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant='danger' onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Text</th>
            <th>Options</th>
            <th>Answer</th>
            <th>Keywords</th>
            {user.admin && <th>Author</th>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {myQuestions.length === 0 ? (
            <tr>
              <td colSpan={user.admin ? 7 : 6} className='text-center text-muted'>
                No questions found. Click 'New Question' to create one.
              </td>
            </tr>
          ) : (
            myQuestions.map((q, index) => (
              <tr key={q._id}>
                <td>{index + 1}</td>
                <td>{q.text}</td>
                <td>{q.options.join(', ')}</td>
                <td><strong>{q.options[q.correctAnswerIndex]}</strong></td>
                <td>{q.keywords?.join(', ') || 'N/A'}</td>
                {user.admin && <td><small>{q.author || 'N/A'}</small></td>}
                <td>
                  {canEditDelete(q) ? (
                    <>
                      <Button size='sm' onClick={() => handleEdit(q)} className='me-1'>
                        <EditOutlined />
                      </Button>
                      <Button size='sm' variant='danger' onClick={() => handleDelete(q._id)}>
                        <DeleteOutlined />
                      </Button>
                    </>
                  ) : (
                    <small className='text-muted'>View only</small>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? 'Edit Question' : 'New Question'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group className='mb-3'>
              <Form.Label>Question Text *</Form.Label>
              <Form.Control
                required
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                placeholder='Enter your question'
              />
            </Form.Group>

            {form.options.map((opt, idx) => (
              <Form.Group key={idx} className='mb-3'>
                <Form.Label>Option {idx + 1} *</Form.Label>
                <Form.Control
                  required
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...form.options];
                    newOpts[idx] = e.target.value;
                    setForm({ ...form, options: newOpts });
                  }}
                  placeholder={`Enter option ${idx + 1}`}
                />
              </Form.Group>
            ))}

            <Form.Group className='mb-3'>
              <Form.Label>Correct Answer Index (03) *</Form.Label>
              <Form.Select
                value={form.correctAnswerIndex}
                onChange={(e) =>
                  setForm({ ...form, correctAnswerIndex: Number(e.target.value) })
                }
              >
                <option value={0}>Option 1</option>
                <option value={1}>Option 2</option>
                <option value={2}>Option 3</option>
                <option value={3}>Option 4</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Keywords (comma separated)</Form.Label>
              <Form.Control
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                placeholder='e.g., javascript, react, programming'
              />
              <Form.Text className='text-muted'>
                Optional: Add keywords separated by commas
              </Form.Text>
            </Form.Group>

            <div className='d-flex gap-2'>
              <Button variant='primary' type='submit' className='flex-grow-1'>
                {editingId ? 'Update' : 'Create'} Question
              </Button>
              <Button variant='secondary' onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
