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

export const CrearVenta = async (ventaData) => {
  const token = obtenerToken();
  const res = await fetch(`${API_URL}/ventas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(ventaData),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Error en la creación de la venta");
  }

  return res.json();
};

