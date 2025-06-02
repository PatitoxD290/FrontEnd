import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

const CompraUsuarioForm = ({ show, handleClose, agregar, actualizar, compraSeleccionada }) => {
  const [idCliente, setIdCliente] = useState("");
  const [idProducto, setIdProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (compraSeleccionada) {
      setIdCliente(compraSeleccionada.id_cliente || "");
      setIdProducto(compraSeleccionada.id_producto || "");
      setCantidad(compraSeleccionada.cantidad || "");
    } else {
      setIdCliente("");
      setIdProducto("");
      setCantidad("");
    }
    setErrores({});
  }, [compraSeleccionada]);

  const validar = () => {
    const nuevosErrores = {};
    if (!idCliente.trim()) nuevosErrores.idCliente = "El ID del cliente es obligatorio";
    if (!idProducto.trim()) nuevosErrores.idProducto = "El ID del producto es obligatorio";
    if (!cantidad.trim() || isNaN(cantidad) || parseInt(cantidad) <= 0) {
      nuevosErrores.cantidad = "La cantidad debe ser un número mayor a 0";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) {
      Swal.fire("Campos inválidos", "Por favor revisa los datos ingresados", "error");
      return;
    }

    const nuevaCompra = {
      id_cliente: idCliente,
      id_producto: idProducto,
      cantidad: parseInt(cantidad),
    };

    if (compraSeleccionada) {
      actualizar(compraSeleccionada.id, nuevaCompra);
    } else {
      agregar(nuevaCompra);
    }

    setIdCliente("");
    setIdProducto("");
    setCantidad("");
    setErrores({});
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {compraSeleccionada ? "Editar Compra" : "Agregar Compra"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>
          <Form.Group className="mb-3">
            <Form.Label>ID Cliente</Form.Label>
            <Form.Control
              type="text"
              value={idCliente}
              onChange={(e) => setIdCliente(e.target.value)}
              isInvalid={!!errores.idCliente}
            />
            <Form.Control.Feedback type="invalid">
              {errores.idCliente}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ID Producto</Form.Label>
            <Form.Control
              type="text"
              value={idProducto}
              onChange={(e) => setIdProducto(e.target.value)}
              isInvalid={!!errores.idProducto}
            />
            <Form.Control.Feedback type="invalid">
              {errores.idProducto}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              isInvalid={!!errores.cantidad}
            />
            <Form.Control.Feedback type="invalid">
              {errores.cantidad}
            </Form.Control.Feedback>
          </Form.Group>

          <Button className="btn-add-primary" type="submit">
            {compraSeleccionada ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CompraUsuarioForm;
