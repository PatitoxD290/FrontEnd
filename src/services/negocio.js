const API_URL = "http://localhost:3001/api/v1"; // Base URL de la API

// Obtener el token del localStorage
const obtenerToken = () => {
  return localStorage.getItem("token");
};

// Obtener el id_usuario del localStorage
export const obtenerIdUsuario = () => {
  return localStorage.getItem("idUsuario");
};

// Obtener el id_cliente del localStorage
export const obtenerIdCliente = () => {
  return localStorage.getItem("idCliente");
};

// Función para manejar la respuesta de fetch
const manejarRespuesta = async (respuesta) => {
  const data = await respuesta.json();

  if (!respuesta.ok) {
    // Puedes personalizar el manejo de errores aquí
    const error = (data && data.message) || respuesta.statusText || "Error desconocido";
    throw new Error(error);
  }
  return data;
};

// Función general para hacer peticiones HTTP
const hacerPeticion = async (url, metodo = 'GET', datos = null) => {
  try {
    const token = obtenerToken();

    const config = {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
    };

    if (datos) {
      config.body = JSON.stringify(datos);
    }

    const respuesta = await fetch(url, config);
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error en la petición:", error.message);
    throw error;
  }
};

// Obtener datos de boleta de un cliente
export const obtenerDatosBoletaCliente = async (id_cliente) => {
  return await hacerPeticion(`${API_URL}/clientes-boleta/${id_cliente}`);
};

// Obtener correo del usuario
export const obtenerCorreo = async (idUsuario) => {
  return await hacerPeticion(`${API_URL}/usuarios/${idUsuario}`);
};

// Enviar código de verificación al correo (supongo que envías email para iniciar verificación)
export const EnviarVerificacionPago = async (email) => {
  return await hacerPeticion(`${API_URL}/codigo-pago`, 'POST', { email });
};

// Verificar el código de pago ingresado
export const VerificacionPago = async (code) => {
  return await hacerPeticion(`${API_URL}/verificar-pago`, 'POST', { code });
};

// Crear venta
export const CrearVenta = async (data) => {
  try {
    const url = `${API_URL}/ventas`; 
    return await hacerPeticion(url, 'POST', data); 
  } catch (error) {
    console.error("Error en la creación de la venta:", error.message);
    throw error;
  }
};

// Obtener todas las ventas
export const obtenerVentas = async () => {
  return await hacerPeticion(`${API_URL}/ventas`);
};

// Obtener detalles de una venta específica
export const obtenerDetallesVenta = async (id_venta) => {
  return await hacerPeticion(`${API_URL}/ventas-detalle/${id_venta}`);
};
