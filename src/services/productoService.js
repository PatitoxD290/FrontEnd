const API_URL = "http://localhost:3001/api/v1";

// Obtener el token del localStorage
const obtenerToken = () => {
  return localStorage.getItem("token");
};

// Función para manejar respuestas de la API
const manejarRespuesta = async (respuesta) => {
  if (!respuesta.ok) {
    const error = await respuesta.json();
    throw new Error(error.error || "Error en la solicitud");
  }
  return await respuesta.json();
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

// Obtener productos
export const obtenerProductos = async () => {
  return await hacerPeticion(`${API_URL}/productos`);
};

// Actualizar un producto
export const actualizarProducto = async (id_producto, producto) => {
  return await hacerPeticion(`${API_URL}/productos/${id_producto}`, 'PUT', producto);
};

// Otras funciones útiles si las necesitas en el futuro
export const eliminarProducto = async (id_producto) => {
  return await hacerPeticion(`${API_URL}/productos/${id_producto}`, 'DELETE');
};

export const crearProducto = async (producto) => {
  return await hacerPeticion(`${API_URL}/productos`, 'POST', producto);
};
