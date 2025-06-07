import React, { useState, useEffect } from "react";
import { obtenerProductos, actualizarProducto, crearProducto } from "../services/productoService";
import ProductoList from "../components/Productos/ProductoList";
import ProductoForm from "../components/Productos/ProductoForm";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");  // Estado para el mensaje de éxito

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const datos = await obtenerProductos();
      setProductos(datos);
      setMensajeExito("");  // Limpiar mensaje de éxito al cargar productos
    } catch (err) {
      setError(err.message);
    }
  };

  const actualizar = async (id_producto, producto) => {
    try {
      await actualizarProducto(id_producto, producto);
      cargarProductos();
      setProductoSeleccionado(null);
      setMostrarModal(false);
      setMensajeExito("Producto actualizado correctamente!");  // Mensaje de éxito
    } catch (err) {
      setError(err.message);
    }
  };

  const crear = async (nuevoProducto) => {
    try {
      await crearProducto(nuevoProducto);
      cargarProductos();
      setMostrarModal(false);
      setMensajeExito("Producto agregado correctamente!");  // Mensaje de éxito
    } catch (err) {
      setError(err.message);
    }
  };

  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setMostrarModal(true);
  };

  const abrirModalNuevo = () => {
    setProductoSeleccionado(null); // importante
    setMostrarModal(true);
  };

  return (
    <div className="container-gestion">
      <h2 className="gestion-title">GESTIÓN DE PRODUCTOS</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensajeExito && <p style={{ color: "green" }}>{mensajeExito}</p>}  {/* Mostrar mensaje de éxito */}

      <button className="btn-add" onClick={abrirModalNuevo}>
        + Agregar Producto
      </button>

      <ProductoList productos={productos} seleccionar={seleccionarProducto} />

      <ProductoForm
        show={mostrarModal}
        handleClose={() => {
          setMostrarModal(false);
          setError("");  // Limpiar errores cuando se cierra el modal
        }}
        actualizar={actualizar}
        crear={crear}
        productoSeleccionado={productoSeleccionado}
      />
    </div>
  );
};

export default Productos;
