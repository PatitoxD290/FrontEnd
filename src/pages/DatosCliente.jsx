import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/styleDatosC.css";

const DatosCliente = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    email: "",
    metodoPago: "transferencia",
  });
  const [guardarDatos, setGuardarDatos] = useState(false);

  useEffect(() => {
    // Cargar datos guardados si existen
    const datosGuardados = localStorage.getItem("datosCliente");
    if (datosGuardados) {
      setCliente(JSON.parse(datosGuardados));
    }
  }, []);

  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const productos = state?.productos || [];

  const totalCalculado = productos.reduce((acc, p) => {
    return acc + (parseFloat(p.precio) || 0) * (parseInt(p.cantidad) || 0);
  }, 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (guardarDatos) {
      localStorage.setItem("datosCliente", JSON.stringify(cliente));
    }

    navigate("/pago", {
      state: {
        productos,
        detalles: state?.detalles || {},
        total: totalCalculado,
        cliente,
      },
    });
  };

  return (
    <div className="datos-cliente-container">
      <h2>Información de envío y pago</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombres:</label>
          <input
            type="text"
            name="nombres"
            value={cliente.nombres}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Apellidos:</label>
          <input
            type="text"
            name="apellidos"
            value={cliente.apellidos}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="tel"
            name="telefono"
            value={cliente.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Dirección:</label>
          <textarea
            name="direccion"
            value={cliente.direccion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={cliente.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Método de pago:</label>
          <select
            name="metodoPago"
            value={cliente.metodoPago}
            onChange={handleChange}
          >
            <option value="transferencia">Transferencia Bancaria</option>
            <option value="tarjeta">Tarjeta de Crédito/Débito</option>
            <option value="yape">Yape/Plin</option>
          </select>
        </div>

        <div className="form-group-check">
          <input
            type="checkbox"
            id="guardarDatos"
            checked={guardarDatos}
            onChange={() => setGuardarDatos(!guardarDatos)}
          />
          <label htmlFor="guardarDatos">
            Guardar mis datos para próximas compras
          </label>
        </div>

        <button type="submit" className="btn-pagar">
          Proceder al pago
        </button>
      </form>
    </div>
  );
};

export default DatosCliente;
