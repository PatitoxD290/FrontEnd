import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ProductoForm = ({ show, handleClose, agregar, actualizar, productoSeleccionado }) => {
  const [producto, setProducto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [costo, setCosto] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [material, setMaterial] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (productoSeleccionado) {
      setProducto(productoSeleccionado.producto || "");
      setDescripcion(productoSeleccionado.descripcion || "");
      setPrecio(productoSeleccionado.precio || "");
      setCosto(productoSeleccionado.costo || "");
      setIdCategoria(productoSeleccionado.id_categoria || "");
      setMaterial(productoSeleccionado.material || "");
      setEstado(productoSeleccionado.estado || "Activo");
    } else {
      setProducto("");
      setDescripcion("");
      setPrecio("");
      setCosto("");
      setIdCategoria("");
      setMaterial("");
      setEstado("Activo");
    }
    setErrores({});
  }, [productoSeleccionado]);

  const validar = () => {
    const nuevosErrores = {};

    if (!producto.trim()) nuevosErrores.producto = "El nombre del producto es obligatorio";
    if (!descripcion.trim()) nuevosErrores.descripcion = "La descripción es obligatoria";
    if (!precio || isNaN(precio)) nuevosErrores.precio = "El precio debe ser numérico";
    if (!costo || isNaN(costo)) nuevosErrores.costo = "El costo debe ser numérico";
    if (!idCategoria) nuevosErrores.idCategoria = "La categoría es obligatoria";
    if (!material.trim()) nuevosErrores.material = "El material es obligatorio";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const nuevoProducto = {
      producto,
      descripcion,
      precio: parseFloat(precio),
      costo: parseFloat(costo),
      id_categoria: idCategoria,
      material,
      estado
    };

    if (productoSeleccionado) {
      actualizar(productoSeleccionado.id_producto, nuevoProducto);
    } else {
      agregar(nuevoProducto);
    }

    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{productoSeleccionado ? "Editar Producto" : "Agregar Producto"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio}>
          <Form.Group className="mb-3">
            <Form.Label>Producto</Form.Label>
            <Form.Control
              type="text"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              isInvalid={!!errores.producto}
            />
            <Form.Control.Feedback type="invalid">{errores.producto}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              isInvalid={!!errores.descripcion}
            />
            <Form.Control.Feedback type="invalid">{errores.descripcion}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="0.01"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              isInvalid={!!errores.precio}
            />
            <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Costo</Form.Label>
            <Form.Control
              type="number"
              min="0"
              step="0.01"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
              isInvalid={!!errores.costo}
            />
            <Form.Control.Feedback type="invalid">{errores.costo}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría (ID)</Form.Label>
            <Form.Control
              type="number"
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
              isInvalid={!!errores.idCategoria}
            />
            <Form.Control.Feedback type="invalid">{errores.idCategoria}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Material</Form.Label>
            <Form.Control
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              isInvalid={!!errores.material}
            />
            <Form.Control.Feedback type="invalid">{errores.material}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" className="btn-add-primary">
            {productoSeleccionado ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductoForm;
