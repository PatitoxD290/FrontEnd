import React, { useState, useEffect } from "react";
import { obtenerComprasUsuario} from "../services/compraUsuarioService";
import CompraUsuarioList from "../components/ComprasUsuario/CompraUsuarioList";

const CompraUsuario = () => {
  const [compras, setCompras] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarCompras = async () => {
      try {
        const datos = await obtenerComprasUsuario();
        setCompras(datos);
      } catch (err) {
        setError(err.message || "Error al cargar compras");
      }
    };

    cargarCompras();
  }, []);

  return (
    <div className="container-gestion-user">
      <h2>MIS COMPRAS</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <CompraUsuarioList compras={compras} />
    </div>
  );
};

export default CompraUsuario;
