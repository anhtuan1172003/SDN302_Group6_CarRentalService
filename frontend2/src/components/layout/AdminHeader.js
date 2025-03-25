// src/components/layout/AdminHeader.js
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

const AdminHeader = () => {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Car Rental</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/cars">
                <Nav.Link>Cars</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/about">
                <Nav.Link>About</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/contact">
                <Nav.Link>Contact</Nav.Link>
              </LinkContainer>
            </Nav>
            <Nav>
              <NavDropdown title="ADMIN" id="admin-nav-dropdown">
                <LinkContainer to="/admin/cars">
                  <NavDropdown.Item>Manage Cars</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/bookings">
                  <NavDropdown.Item>Manage Bookings</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/users">
                  <NavDropdown.Item>Manage Users</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/cars">
                  <NavDropdown.Item>Browse Cars</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to="/changepassword">
                  <NavDropdown.Item>Change Password</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default AdminHeader;