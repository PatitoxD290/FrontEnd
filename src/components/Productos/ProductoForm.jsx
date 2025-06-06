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
  const [genero, setGenero] = useState("Hombre");   // agregado
  const [edad, setEdad] = useState("Adultos");      // agregado
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
      setGenero(productoSeleccionado.genero || "Hombre");  // agregado
      setEdad(productoSeleccionado.edad || "Adultos");      // agregado
      setImagen(null);
    } else {
      setProducto("");
      setDescripcion("");
      setPrecio("");
      setCosto("");
      setIdCategoria("");
      setMaterial("");
      setEstado("Activo");
      setGenero("Hombre");  // agregado
      setEdad("Adultos");   // agregado
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

    if (!genero) nuevosErrores.genero = "El género es obligatorio"; // agregado
    if (!edad) nuevosErrores.edad = "La edad es obligatoria";       // agregado

    if (imagen && imagen.type !== "image/jpeg") {
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
    formData.append("genero", genero);  // agregado
    formData.append("edad", edad);      // agregado

    if (imagen) {
      formData.append("imagen", imagen);
    }

    if (productoSeleccionado) {
      actualizar(productoSeleccionado.id_producto, formData);
    } else {
      agregar(formData);
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
          {/* ...otros campos... */}

          <Form.Group className="mb-3">
            <Form.Label>Género</Form.Label>
            <Form.Select value={genero} onChange={(e) => setGenero(e.target.value)} isInvalid={!!errores.genero}>
              <option value="">Selecciona...</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errores.genero}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Edad</Form.Label>
            <Form.Select value={edad} onChange={(e) => setEdad(e.target.value)} isInvalid={!!errores.edad}>
              <option value="">Selecciona...</option>
              <option value="Niños">Niños</option>
              <option value="Adolescentes">Adolescentes</option>
              <option value="Adultos">Adultos</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errores.edad}</Form.Control.Feedback>
          </Form.Group>

          {/* Resto de campos */}
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

          {/* Aquí van los demás grupos de formulario que ya tienes... */}

          <Button type="submit" className="btn-add-primary">
            {productoSeleccionado ? "Actualizar" : "Agregar"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductoForm;
