import React, { useContext } from "react";
import { Navbar as BsNavbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../css/NavarAndFooter.css";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <BsNavbar fixed="top">
      <Container>
        <BsNavbar.Brand as={Link} to="/home">
          <img src="/Images/logo-kym.png" height="40" alt="" />
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/usuarios">Usuarios</Nav.Link>
                <Nav.Link as={Link} to="/clientes">Clientes</Nav.Link>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link> {/* 🚀 Nuevo link */}
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/acceder">Acceder</Nav.Link>
              </>
            )}
          </Nav>

          {user && (
            <Dropdown align="end">
              <Dropdown.Toggle>
                {user.user?.toUpperCase()}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => alert("Creado por El Mejor Grupo de DSI V 😜")}>
                  Acerca de
                </Dropdown.Item>
                <Dropdown.Item onClick={() => alert("Funcionalidad aún no implementada")}>
                  Cambiar contraseña
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
