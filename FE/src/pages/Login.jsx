import React, { useContext, useState } from "react";
import axiosClient from "../api/axiosClient";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Form, Card } from "react-bootstrap";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  // error will hold a normalized error object { status, message, details, raw }
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axiosClient.post("/users/login", form);
      const token = res.data.token;

      // Lưu token vào localStorage
      localStorage.setItem("token", token);

      // Decode JWT token để lấy id
      const payload = JSON.parse(atob(token.split(".")[1]));

      let userData = {
        id: payload.id,
        username: form.username,
        admin: false,
      };

      try {
        const usersRes = await axiosClient.get("/users");
        // Nếu gọi thành công => user là admin
        const currentUser = usersRes.data.find((u) => u.id === payload.id);
        if (currentUser) {
          userData = {
            id: currentUser.id,
            username: currentUser.username,
            admin: currentUser.admin || false,
          };
        }
      } catch (err) {
        // Nếu lỗi 403 => không phải admin, giữ nguyên userData với admin = false
        if (err.response?.status !== 403) {
          throw err;
        }
      }

      login(userData, token);
      navigate("/");
    } catch (err) {
      // Prefer normalized error attached by axios client
      const e = err.normalized || (err.response && err.response.data) || { message: err.message };
      // ensure an object shape
      const norm = typeof e === "string" ? { message: e } : e;
      setError({ status: norm.status, message: norm.message || "Login failed", details: norm.details, raw: norm.raw });
    }
  };

  return (
    <Card className="m-5 p-4 mx-auto" style={{ maxWidth: 400 }}>
      <h3>Login</h3>
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

        {error && (
          <div className="mt-2">
            <p className="text-danger mb-1">
              {error.status ? `(${error.status}) ` : ""}
              {error.message}
            </p>
            {/* Show stack/details only in development (Vite) */}
            {import.meta?.env?.DEV && error.details && (
              <pre className="small text-muted" style={{ whiteSpace: "pre-wrap" }}>
                {typeof error.details === "string"
                  ? error.details
                  : JSON.stringify(error.details, null, 2)}
              </pre>
            )}
          </div>
        )}

        <Button type="submit" className="mt-3 w-100">
          Login
        </Button>
      </Form>
    </Card>
  );
}
