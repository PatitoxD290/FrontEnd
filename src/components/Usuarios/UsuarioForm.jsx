// UsuariosForm.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const UsuariosForm = ({ show, handleClose, actualizar, usuarioSeleccionado }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (usuarioSeleccionado) {
      setUser(usuarioSeleccionado.user || '');
      setPassword(usuarioSeleccionado.password || '');
    } else {
      setUser("");
      setPassword("");
    }
    setErrores({});
  }, [usuarioSeleccionado]);

  const validar = () => {
    const nuevosErrores = {};
    if (!user.trim()) nuevosErrores.user = "El usuario es obligatorio";
   if (!password.trim()) {
    nuevosErrores.password = "Actualize la contraseña correctamente";
  } else if (password.length < 8) {
    nuevosErrores.password = "La contraseña debe tener al menos 8 caracteres";
  } else if (!/[A-Z]/.test(password)) {
    nuevosErrores.password = "Debe contener al menos una letra mayúscula";
  } else if (!/[a-z]/.test(password)) {
    nuevosErrores.password = "Debe contener al menos una letra minúscula";
  } else if (!/[0-9]/.test(password)) {
    nuevosErrores.password = "Debe contener al menos un número";
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    nuevosErrores.password = "Debe contener al menos un carácter especial";
  }
  return nuevosErrores;
  };

  const manejarEnvio = (e) => {
  e.preventDefault();
  const nuevosErrores = validar();
  setErrores(nuevosErrores);

  if (Object.keys(nuevosErrores).length > 0) {
      return;
  }

  const usuarioActualizado = { user, password };
  actualizar(usuarioSeleccionado.id_usuario, usuarioActualizado);

  setUser("");
  setPassword("");
  setErrores({});
  handleClose();
};


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>
          <Form.Group className="mb-1">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              isInvalid={!!errores.user}
            />
            <Form.Control.Feedback type="invalid">
              {errores.user}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errores.password}
            /> <br />
            <Form.Control.Feedback type="invalid">
              {errores.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Button className="btn-add-primary" type="submit">
            Actualizar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UsuariosForm;
