import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { Button, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/users/register", form);
      setMsg("✅ Registration successful! You can now login.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg("❌ Registration failed");
    }
  };

  return (
    <Card className="m-5 p-4 mx-auto" style={{ maxWidth: 400 }}>
      <h3>Register</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </Form.Group>
        <Button type="submit" className="mt-3 w-100">Register</Button>
      </Form>
      {msg && <p className="mt-3">{msg}</p>}
    </Card>
  );
}
