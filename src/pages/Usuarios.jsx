import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import {
  obtenerUsuarios,
  actualizarUsuario,
} from "../services/usuarioService";
import UsuarioList from "../components/Usuarios/UsuarioList";
import UsuarioForm from "../components/Usuarios/UsuarioForm";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Obtener el token almacenado en localStorage
  const token = localStorage.getItem("token");

  // Si no hay token, redirigir al login
  if (!token) {
    window.location.href = "/login"; // Redirigir a la página de login
  }

  // Cargar usuarios desde la API
  const cargarUsuarios = async () => {
    try {
      const datos = await obtenerUsuarios(token);
      setUsuarios(datos);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Seleccionar un usuario para editar
  const seleccionarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModal(true);
  };

  // Actualizar usuario
  const actualizar = async (id_usuario, usuario) => {
    try {
      await actualizarUsuario(id_usuario, usuario, token); // Solo actualiza el nombre o la contraseña
      cargarUsuarios(); // Recargar los usuarios
      setUsuarioSeleccionado(null);
      setMostrarModal(false);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  return (
    <div className="container-admin">
      <h2 className="admin-title">GESTIÓN DE USUARIOS</h2>

      <UsuarioList
        usuarios={usuarios}
        seleccionar={seleccionarUsuario}
      />

      <UsuarioForm
        show={mostrarModal}
        handleClose={() => setMostrarModal(false)}
        actualizar={actualizar}
        usuarioSeleccionado={usuarioSeleccionado}
      />
    </div>
  );
};

export default Usuarios;
