import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Navbar as BsNavbar, Container, Nav } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <BsNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BsNavbar.Brand as={Link} to="/">� Quiz System</BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Quizzes</Nav.Link>
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
            {user && (
              <>
                <Nav.Link as={Link} to="/questions">
                  {user.admin ? "All Questions" : "My Questions"}
                </Nav.Link>
                {user.admin && (
                  <Nav.Link as={Link} to="/users">Users</Nav.Link>
                )}
                <Nav.Item className="d-flex align-items-center ms-2">
                  <span className="text-light me-2">
                    {user.admin ? "👑" : "👤"} {user.username}
                  </span>
                  <Button variant="outline-light" size="sm" onClick={logout}>
                    Logout
                  </Button>
                </Nav.Item>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
