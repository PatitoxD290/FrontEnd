import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/styleDatosC.css";
import { useAuth } from "../context/AuthContext";

const DatosCliente = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cliente, setCliente] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    direccion: "",
    dni: "",
  });

  const [guardarDatos, setGuardarDatos] = useState(false);

  useEffect(() => {
    const guardado = localStorage.getItem("datosCliente");
    if (guardado) {
      try {
        setCliente(JSON.parse(guardado));
      } catch {
        console.warn("Error al leer datosCliente desde localStorage");
      }
    }
  }, []);

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const productos = state?.productos || [];
  const detalles = state?.detalles || [];

  const totalCalculado = productos.reduce((acc, p) => {
    const precio = parseFloat(p.precio) || 0;
    const cantidad = parseInt(p.cantidad) || 0;
    return acc + precio * cantidad;
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cliente.nombres || !cliente.apellidos || !cliente.telefono || !cliente.direccion) {
      return alert("Todos los campos obligatorios deben estar llenos");
    }

    let clienteFinal = { ...cliente };

    if (guardarDatos && user?.id_usuario) {
      try {
        const response = await fetch("http://localhost:3001/api/v1/clientes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...cliente,
            id_usuario: user.id_usuario,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data?.error || "Error desconocido");
        }

        const data = await response.json();
        clienteFinal = data; // usamos el cliente actualizado o creado

        // Guardar en localStorage
        localStorage.setItem("datosCliente", JSON.stringify(data));
        localStorage.setItem("idCliente", data.id_cliente);
      } catch (error) {
        console.error("Error al guardar cliente:", error);
        return alert("No se pudo guardar el cliente");
      }
    }

    // Continuar al pago, siempre pasando los datos
    navigate("/pago", {
      state: {
        productos,
        detalles,
        cliente: clienteFinal,
      },
    });
  };

  return (
    <div className="datos-cliente-container">
      <h2>Información de envío</h2>
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
          <label>DNI:</label>
          <input
            type="text"
            name="dni"
            value={cliente.dni}
            onChange={handleChange}
            maxLength="8"
            required
          />
        </div>

        <div className="form-group-check">
          <input
            type="checkbox"
            id="guardarDatos"
            checked={guardarDatos}
            onChange={() => setGuardarDatos(!guardarDatos)}
          />
          <label htmlFor="guardarDatos">
            Guardar mis datos para futuras compras
          </label>
        </div>

        <button type="submit" className="btn-pagar">
          Continuar al pago
        </button>
      </form>
    </div>
  );
};

export default DatosCliente;
