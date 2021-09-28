import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";

export default function NavBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="Mongo">OLYMPICS GAME NEWS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="Mongo">MONGO</Nav.Link>
            <Nav.Link href="MYSQL">MYSQL</Nav.Link>
            <NavDropdown title="Reportes" id="basic-nav-dropdown">
              <NavDropdown.Item href="ReporteMongo">
                Reporte Mongo
              </NavDropdown.Item>
              <NavDropdown.Item href="ReporteMysql">
                Reporte Mysql
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
