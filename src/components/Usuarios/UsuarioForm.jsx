import React, { useState, useEffect } from "react";

const ClienteForm = ({ show, handleClose, actualizar, clienteSeleccionado }) => {
  const [cliente, setCliente] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    // Otros campos de cliente...
  });

  useEffect(() => {
    if (clienteSeleccionado) {
      setCliente(clienteSeleccionado);
    }
  }, [clienteSeleccionado]);

  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actualizar(cliente.id_cliente, cliente); // Llama a la función para actualizar
  };

  return (
    <div style={{ display: show ? "block" : "none" }}>
      <h3>Editar Cliente</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombres</label>
          <input
            type="text"
            name="nombres"
            value={cliente.nombres}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Apellidos</label>
          <input
            type="text"
            name="apellidos"
            value={cliente.apellidos}
            onChange={handleChange}
          />
        </div>
        {/* Aquí puedes añadir más campos según los detalles de cliente */}
        <div>
          <button type="submit">Actualizar</button>
          <button type="button" onClick={handleClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default ClienteForm;
