// UsuariosForm.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const UsuariosForm = ({ show, handleClose, actualizar, usuarioSeleccionado }) => {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (usuarioSeleccionado) {
      setNombres(usuarioSeleccionado.nombres || "");
      setApellidos(usuarioSeleccionado.apellidos || "");
      setTelefono(usuarioSeleccionado.telefono || "");
      setCorreo(usuarioSeleccionado.correo || "");
    } else {
      setNombres("");
      setApellidos("");
      setTelefono("");
      setCorreo("");
    }
    setErrores({});
  }, [usuarioSeleccionado]);

  const validar = () => {
    const nuevosErrores = {};
    if (!nombres.trim()) nuevosErrores.nombres = "El nombre es obligatorio";
    if (!apellidos.trim()) nuevosErrores.apellidos = "El apellido es obligatorio";
    if (!telefono.trim() || !/^\d{7,15}$/.test(telefono)) {
      nuevosErrores.telefono = "Teléfono inválido (7 a 15 dígitos)";
    }
    if (!correo.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      nuevosErrores.correo = "Correo electrónico inválido";
    }
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) {
      Swal.fire("Campos inválidos", "Por favor revisa los datos ingresados", "error");
      return;
    }

    const usuarioActualizado = { nombres, apellidos, telefono, correo};
    actualizar(usuarioSeleccionado.id_usuario, usuarioActualizado);

    setNombres("");
    setApellidos("");
    setTelefono("");
    setCorreo("");
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
          <Form.Group className="mb-3">
            <Form.Label>Nombres</Form.Label>
            <Form.Control
              type="text"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              isInvalid={!!errores.nombres}
            />
            <Form.Control.Feedback type="invalid">
              {errores.nombres}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Apellidos</Form.Label>
            <Form.Control
              type="text"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              isInvalid={!!errores.apellidos}
            />
            <Form.Control.Feedback type="invalid">
              {errores.apellidos}
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
