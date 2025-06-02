const API_URL = "http://localhost:3001/api/v1";

// Obtener el token del localStorage
const obtenerToken = () => {
  return localStorage.getItem("token");
};

// Función general para hacer peticiones HTTP
const hacerPeticion = async (url, metodo = 'GET', datos = null) => {
  try {
    const token = obtenerToken();

    const config = {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include", // Si necesitas cookies
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

// Función auxiliar para manejar la respuesta
const manejarRespuesta = async (respuesta) => {
  if (!respuesta.ok) {
    const error = await respuesta.text();
    throw new Error(error || "Error en la respuesta del servidor");
  }
  return await respuesta.json();
};

// Obtener ventas por mes
export const obtenerlasventaspormes = async () => {
  return await hacerPeticion(`${API_URL}/ventas-mes`);
};

// Obtener productos más vendidos
export const otenerprodutosmasvendidos = async () => {
  return await hacerPeticion(`${API_URL}/ventas-productos-mas-vendidos`);
};


// Obtener todas las ventas
export const obtenerVentas = async () => {
  return await hacerPeticion(`${API_URL}/ventas`);
};

// Obtener detalles de una venta específica
export const obtenerDetallesVenta = async (id_venta) => {
  return await hacerPeticion(`${API_URL}/ventas-detalle/${id_venta}`);
};
