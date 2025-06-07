import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ProductoForm = ({ show, handleClose, crear, actualizar, productoSeleccionado }) => {
  const [producto, setProducto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [costo, setCosto] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [material, setMaterial] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [genero, setGenero] = useState("Hombre");
  const [edad, setEdad] = useState("Adultos");
  const [imagen, setImagen] = useState(null);
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
      setGenero(productoSeleccionado.genero || "Hombre");
      setEdad(productoSeleccionado.edad || "Adultos");
      setImagen(null);
    } else {
      setProducto("");
      setDescripcion("");
      setPrecio("");
      setCosto("");
      setIdCategoria("");
      setMaterial("");
      setEstado("Activo");
      setGenero("Hombre");
      setEdad("Adultos");
      setImagen(null);
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
    if (!genero) nuevosErrores.genero = "El género es obligatorio";
    if (!edad) nuevosErrores.edad = "La edad es obligatoria";
    if (!productoSeleccionado && imagen && imagen.type !== "image/jpeg") {
      nuevosErrores.imagen = "Solo se aceptan archivos JPEG";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const formData = new FormData();
    formData.append("producto", producto);
    formData.append("descripcion", descripcion);
    formData.append("precio", parseFloat(precio));
    formData.append("costo", parseFloat(costo));
    formData.append("id_categoria", idCategoria);
    formData.append("material", material);
    formData.append("estado", estado);
    formData.append("genero", genero);
    formData.append("edad", edad);

    if (!productoSeleccionado && imagen) {
      formData.append("catalogo", imagen);
    }

    if (productoSeleccionado) {
      actualizar(productoSeleccionado.id_producto, formData);
    } else {
      crear(formData);
    }

    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{productoSeleccionado ? "Editar Producto" : "Agregar Producto"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={manejarEnvio} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Producto</Form.Label>
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
              type="text"
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
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              isInvalid={!!errores.precio}
              step="0.01"
            />
            <Form.Control.Feedback type="invalid">{errores.precio}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Costo</Form.Label>
            <Form.Control
              type="number"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
              isInvalid={!!errores.costo}
              step="0.01"
            />
            <Form.Control.Feedback type="invalid">{errores.costo}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Control
              as="select"
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
              isInvalid={!!errores.idCategoria}
            >
              <option value="">Selecciona...</option>
              <option value="1">Categoría 1</option>
              <option value="2">Categoría 2</option>
              <option value="3">Categoría 3</option>
            </Form.Control>
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
            <Form.Control as="select" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Género</Form.Label>
            <Form.Select
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
              isInvalid={!!errores.genero}
            >
              <option value="">Selecciona...</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errores.genero}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Edad</Form.Label>
            <Form.Select
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              isInvalid={!!errores.edad}
            >
              <option value="">Selecciona...</option>
              <option value="Niños">Niños</option>
              <option value="Adolescentes">Adolescentes</option>
              <option value="Adultos">Adultos</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errores.edad}</Form.Control.Feedback>
          </Form.Group>

          {!productoSeleccionado && (
            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setImagen(e.target.files[0])}
                isInvalid={!!errores.imagen}
              />
              <Form.Control.Feedback type="invalid">{errores.imagen}</Form.Control.Feedback>
            </Form.Group>
          )}

          <Button type="submit" className="btn-add-primary">
            {productoSeleccionado ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductoForm;
