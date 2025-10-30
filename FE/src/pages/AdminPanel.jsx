import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { UserOutlined, QuestionCircleOutlined, FileTextOutlined } from "@ant-design/icons";

export default function AdminPanel() {
  const [stats, setStats] = useState({
    users: [],
    questionsCount: 0,
    quizzesCount: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, questionsRes, quizzesRes] = await Promise.all([
        axiosClient.get("/users"),
        axiosClient.get("/questions"),
        axiosClient.get("/quizzes")
      ]);
      
      setStats({
        users: usersRes.data,
        questionsCount: questionsRes.data.length,
        quizzesCount: quizzesRes.data.length
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">👑 Users Management (Admin)</h2>
      
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <UserOutlined style={{ fontSize: "3rem", color: "#1890ff" }} />
              <h3 className="mt-3">{stats.users.length}</h3>
              <p className="text-muted">Total Users</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <QuestionCircleOutlined style={{ fontSize: "3rem", color: "#52c41a" }} />
              <h3 className="mt-3">{stats.questionsCount}</h3>
              <p className="text-muted">Total Questions</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <FileTextOutlined style={{ fontSize: "3rem", color: "#faad14" }} />
              <h3 className="mt-3">{stats.quizzesCount}</h3>
              <p className="text-muted">Total Quizzes</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">All Users</h5>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Admin</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {stats.users.map((user, idx) => (
                <tr key={user.id}>
                  <td>{idx + 1}</td>
                  <td>{user.username}</td>
                  <td>
                    {user.admin ? (
                      <span className="badge bg-success">Admin</span>
                    ) : (
                      <span className="badge bg-secondary">User</span>
                    )}
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
