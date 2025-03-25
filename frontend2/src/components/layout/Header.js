"use client"

import { useContext } from "react"
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import AuthContext from "../../context/AuthContext"

const Header = () => {
  const { user, logout, isAdmin } = useContext(AuthContext)

  // If user is admin, this header won't be used
  if (user && isAdmin()) {
    return null
  }

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
              {user ? (
                <>
                  {isAdmin() && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/cars">
                        <NavDropdown.Item>Cars</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/bookings">
                        <NavDropdown.Item>Bookings</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                  <NavDropdown title={user.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/changepassword">
                      <NavDropdown.Item>Change Password</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/mybookings">
                      <NavDropdown.Item>My Bookings</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/mycars">
                      <NavDropdown.Item>My Cars</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/my_wallet">
                      <NavDropdown.Item>My Wallet</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/addcar">
                      <NavDropdown.Item>Add Car</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <i className="fas fa-user"></i> Sign In
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <i className="fas fa-user-plus"></i> Register
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header