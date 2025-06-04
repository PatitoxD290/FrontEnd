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
    const { name, value } = e.target;

    if (name === "nombres" || name === "apellidos") {
      // Solo letras y espacios
      if (/^[a-zA-Z\s]*$/.test(value)) {
        setCliente({ ...cliente, [name]: value });
      }
    } else if (name === "telefono") {
      // Solo números, máx 9 caracteres
      if (/^\d{0,9}$/.test(value)) {
        setCliente({ ...cliente, [name]: value });
      }
    } else if (name === "dni") {
      // Solo números, máx 8 caracteres
      if (/^\d{0,8}$/.test(value)) {
        setCliente({ ...cliente, [name]: value });
      }
    } else {
      setCliente({ ...cliente, [name]: value });
    }
  };

  const productos = state?.productos || [];
  const detalles = state?.detalles || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !cliente.nombres ||
      !cliente.apellidos ||
      !cliente.telefono ||
      !cliente.direccion
    ) {
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
      <h2>INFORMACIÓN DE ENVÍO</h2>
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
            type="text"
            name="telefono"
            value={cliente.telefono}
            onChange={handleChange}
            maxLength="9"
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
