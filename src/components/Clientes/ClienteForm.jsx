import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ClienteForm = ({
  show,
  handleClose,
  agregar,
  actualizar,
  clienteSeleccionado,
}) => {
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
    if (!apellidos.trim())
      nuevosErrores.apellidos = "El apellido es obligatorio";

    // Teléfono: exactamente 9 dígitos numéricos
    if (!telefono.trim()) {
      nuevosErrores.telefono = "El teléfono es obligatorio";
    } else if (!/^\d{9}$/.test(telefono)) {
      nuevosErrores.telefono = "El teléfono debe tener exactamente 9 números";
    }

    if (!direccion.trim())
      nuevosErrores.direccion = "La dirección es obligatoria";

    // DNI: exactamente 8 dígitos numéricos
    if (!dni.trim()) {
      nuevosErrores.dni = "El DNI es obligatorio";
    } else if (!/^\d{8}$/.test(dni)) {
      nuevosErrores.dni = "El DNI debe tener exactamente 8 números";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) {
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
    setDni("");
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
              maxLength={9}
              onChange={(e) => {
                const valor = e.target.value.replace(/\D/g, "").slice(0, 9);
                setTelefono(valor);
              }}
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
              maxLength={8}
              onChange={(e) => {
                const valor = e.target.value.replace(/\D/g, "").slice(0, 8);
                setDni(valor);
              }}
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
