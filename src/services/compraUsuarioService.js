const API_URL = "http://localhost:3001/api/v1";

// Obtener token del localStorage
const obtenerToken = () => {
  return localStorage.getItem("token");
};

// Obtener el id_usuario del localStorage
export const obtenerIdUsuario = () => {
  return localStorage.getItem("idUsuario");
};

// Manejar la respuesta de la API
const manejarRespuesta = async (respuesta) => {
  if (!respuesta.ok) {
    const error = await respuesta.json();
    throw new Error(error.error || "Error en la solicitud");
  }
  return await respuesta.json();
};

// Función genérica para peticiones
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

// Obtener todas las compras de un usuario (por su ID desde localStorage)
export const obtenerComprasUsuario = async () => {
  const idUsuario = obtenerIdUsuario();

  if (!idUsuario) {
    throw new Error("No se encontró el id del usuario en localStorage");
  }

  return await hacerPeticion(`${API_URL}/compras_usuario/${idUsuario}`);
};
