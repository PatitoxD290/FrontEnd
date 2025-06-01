import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const ClienteForm = ({ show, handleClose, agregar, actualizar, clienteSeleccionado }) => {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [dni, setDni] = useState(""); // Nuevo estado para DNI
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (clienteSeleccionado) {
      setNombres(clienteSeleccionado.nombres);
      setApellidos(clienteSeleccionado.apellidos);
      setTelefono(clienteSeleccionado.telefono);
      setDireccion(clienteSeleccionado.direccion);
      setDni(clienteSeleccionado.dni); // Cargar el DNI si está disponible
    } else {
      setNombres("");
      setApellidos("");
      setTelefono("");
      setDireccion("");
      setDni(""); // Limpiar el DNI
    }
    setErrores({});
  }, [clienteSeleccionado]);

  const validar = () => {
    const nuevosErrores = {};
    if (!nombres.trim()) nuevosErrores.nombres = "El nombre es obligatorio";
    if (!apellidos.trim()) nuevosErrores.apellidos = "El apellido es obligatorio";
    if (!telefono.trim() || !/^\d{7,15}$/.test(telefono)) {
      nuevosErrores.telefono = "Teléfono inválido (7 a 15 dígitos)";
    }
    if (!direccion.trim()) nuevosErrores.direccion = "La dirección es obligatoria";
    if (!dni.trim()) nuevosErrores.dni = "El DNI es obligatorio"; // Validar DNI no vacío
    else if (dni.length > 8) nuevosErrores.dni = "El DNI no puede tener más de 8 caracteres"; // Validar longitud máxima
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) {
      Swal.fire(
        "Campos inválidos",
        "Por favor revisa los datos ingresados",
        "error"
      );
      return;
    }

    const nuevoCliente = { nombres, apellidos, telefono, direccion, dni }; // Incluir DNI en el objeto cliente

    // Si hay un cliente seleccionado, actualizamos
    if (clienteSeleccionado) {
      actualizar(clienteSeleccionado.id_cliente, nuevoCliente);
    } else {
      // Si no hay cliente seleccionado, agregamos
      agregar(nuevoCliente);
    }

    // Limpiar los campos después de la acción
    setNombres("");
    setApellidos("");
    setTelefono("");
    setDireccion("");
    setDni(""); // Limpiar el campo DNI
    setErrores({});
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {clienteSeleccionado ? "Editar Cliente" : "Agregar Cliente"}
        </Modal.Title>
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

          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              isInvalid={!!errores.telefono}
            />
            <Form.Control.Feedback type="invalid">
              {errores.telefono}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              isInvalid={!!errores.direccion}
            />
            <Form.Control.Feedback type="invalid">
              {errores.direccion}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Campo DNI */}
          <Form.Group className="mb-3">
            <Form.Label>DNI</Form.Label>
            <Form.Control
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              isInvalid={!!errores.dni}
            />
            <Form.Control.Feedback type="invalid">
              {errores.dni}
            </Form.Control.Feedback>
          </Form.Group>

          <Button className="btn-add-primary" type="submit">
            {clienteSeleccionado ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ClienteForm;
