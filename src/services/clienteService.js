const API_URL = "http://localhost:3001/api/v1"; // Base URL de la API

// Obtener el token del localStorage
const obtenerToken = () => {
  return localStorage.getItem("token"); // Obtener el token almacenado
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
    const token = obtenerToken(); // Obtener el token de localStorage

    const config = {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Añadir el token en el encabezado de la petición
      },
      credentials: "include", // Para enviar cookies, si se necesitan para autenticación
    };
    
    if (datos) {
      config.body = JSON.stringify(datos); // Si hay datos, los añadimos al cuerpo
    }
    
    const respuesta = await fetch(url, config);
    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error en la petición:", error.message);
    throw error;
  }
};

// Obtener clientes
export const obtenerClientes = async () => {
  return await hacerPeticion(`${API_URL}/clientes`);
};

// Actualizar un cliente existente
export const actualizarCliente = async (id_cliente, cliente) => {
  return await hacerPeticion(`${API_URL}/clientes/${id_cliente}`, 'PUT', cliente);
};

// Obtener todos los contratos
export const obtenerContratos = async () => {
  return await hacerPeticion(`${API_URL}/contratos`);
};
