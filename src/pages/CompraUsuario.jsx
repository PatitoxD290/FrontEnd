import React, { useState, useEffect } from "react";
import {
  obtenerComprasUsuario
} from "../services/compraUsuarioService";
import CompraUsuarioList from "../components/ComprasUsuario/CompraUsuarioList";
import CompraUsuarioForm from "../components/ComprasUsuario/CompraUsuarioForm";

const CompraUsuario = () => {
  const [compras, setCompras] = useState([]);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarCompras();
  }, []);

  const cargarCompras = async () => {
    try {
      const datos = await obtenerComprasUsuario();
      setCompras(datos);
    } catch (err) {
      setError(err.message);
    }
  };

  const seleccionarCompra = (compra) => {
    setCompraSeleccionada(compra);
    setMostrarModal(true);
  };

  return (
    <div className="container-gestion">
      <h2 className="gestion-title">MIS COMPRAS</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <CompraUsuarioList compras={compras} seleccionar={seleccionarCompra} />
    </div>
  );
};

export default CompraUsuario;
