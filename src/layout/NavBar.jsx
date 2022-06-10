import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/userContext/UserProvider";

const NavBar = () => {
  const { user, logoutUserfn } = useAuth();

  console.log(user)

  return (
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">Aplicativo Actas</Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        {user?.role && (
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link as={NavLink} to="/registro-actas">
                Registro
              </Nav.Link>

              <Nav.Link as={NavLink} to="/control">
                Control
              </Nav.Link>
              <Nav.Link as={NavLink} to="/plan-mantenimiento">
                Plan Mantenimiento
              </Nav.Link>
              {/* <Nav.Link as={NavLink} to="/reporte">
                Reporte
              </Nav.Link> */}
            </Nav>

            <Nav>
              <NavDropdown title={user.name} id="collasible-nav-dropdown">
                {user.role === "admin" && (
                  <>
                    {/* <NavDropdown.Item as={NavLink} to="/admin/basedatos">
                      Base de Datos
                    </NavDropdown.Item> */}
                    <NavDropdown.Item as={NavLink} to='/admin/admin-users'>
                      Admin Users
                    </NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to='/admin/mantencion'>
                  Mantencion
                </NavDropdown.Item>
                  </>
                )}

                <NavDropdown.Divider />
                <NavDropdown.Item
                  href="#action/3.4"
                  onClick={() => logoutUserfn()}
                >
                  Cerrar Sesion
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        )}
      </Container>
    </Navbar>
  );
};

export default NavBar;