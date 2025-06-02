import React, { useState, useEffect } from "react";
import { obtenerClientes, actualizarCliente } from "../services/clienteService";
import ClienteList from "../components/Clientes/ClienteList";
import ClienteForm from "../components/Clientes/ClienteForm";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const datos = await obtenerClientes();
      // Ahora datos es directamente un array de clientes, asignamos directo
      setClientes(datos);
    } catch (err) {
      setError(err.message);
    }
  };

  const actualizar = async (id_cliente, cliente) => {
    try {
      await actualizarCliente(id_cliente, cliente);
      cargarClientes();
      setClienteSeleccionado(null);
      setMostrarModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const seleccionarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarModal(true);
  };

  return (
    <div className="container-gestion">
      <h2 className="gestion-title">GESTIÓN DE CLIENTES</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ClienteList clientes={clientes} seleccionar={seleccionarCliente} />

      <ClienteForm
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        actualizar={actualizar}
        clienteSeleccionado={clienteSeleccionado}
      />
    </div>
  );
};

export default Clientes;
