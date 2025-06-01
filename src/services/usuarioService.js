import axios from "axios";

// URL base de la API, actualiza según corresponda
const API_URL = "http://localhost:3001/api/v1"; 

// Configuración de axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

 // Función para obtener todos los usuarios (requiere autenticación)
export const obtenerUsuarios = async (token) => {
  try {
    const response = await axiosInstance.get("/usuarios", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Devuelve los usuarios
  } catch (error) {
    console.error("Error al obtener usuarios:", error.response ? error.response.data : error.message);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

// Función para agregar un nuevo usuario (registro)
export const agregarUsuario = async (usuario) => {
  try {
    const response = await axiosInstance.post("/register", usuario);
    return response.data; // Devuelve los datos del nuevo usuario
  } catch (error) {
    console.error("Error al registrar usuario:", error.response ? error.response.data : error.message);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

// Función para iniciar sesión (requiere email y contraseña)
export const loginUsuario = async (email, password) => {
  try {
    const response = await axiosInstance.post("/login", { email, password });

    const { token, id_usuario, id_cliente } = response.data;

    // Guardar los datos relevantes en localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("idUsuario", id_usuario); // ✅ nuevo
    localStorage.setItem("idCliente", id_cliente ?? ""); // ✅ nuevo (guardamos cadena vacía si es null)

    return response.data;
  } catch (error) {
    console.error(
      "Error al iniciar sesión:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};



// Función para recuperar la contraseña (requiere el correo del usuario y la nueva contraseña)
export const recuperarContraseña = async (email, newPassword) => {
  try {
    // Se envían ambos parámetros: correo y nueva contraseña
    const response = await axiosInstance.post(`${API_URL}/recuperar-contrase`, { email, newPassword });
    return response.data; // Respuesta de la recuperación (ej. mensaje de éxito)
  } catch (error) {
    console.error("Error al recuperar la contraseña:", error.response ? error.response.data : error.message);
    throw error; // Lanza el error para manejarlo en el componente
  }
};


// Función para enviar el código de verificación al correo
export const enviarCodigoSeguridad = async (email) => {
  try {
    const response = await axiosInstance.post("/send-verification-email", { email });
    return response.data; // Respuesta de la operación (ej. mensaje de éxito si el código fue enviado)
  } catch (error) {
    console.error("Error al enviar el código de verificación:", error.response ? error.response.data : error.message);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

// Función para verificar el código de seguridad
export const verificarCodigoSeguridad = async (codigo) => {
  try {
    // Convertir el código a número
    const numericCode = parseInt(codigo, 10);

    // Validar que el código es numérico
    if (isNaN(numericCode)) {
      throw new Error("El código debe ser numérico");
    }

    // Enviar el código numérico al backend para verificarlo
    const response = await axiosInstance.post("/verify-code", { code: numericCode });
    return response.data; // Devuelve el mensaje de éxito o error
  } catch (error) {
    console.error("Error al verificar el código de seguridad:", error.response ? error.response.data : error.message);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

// Función para actualizar los datos de un usuario (nombre y/o contraseña)
export const actualizarUsuario = async (id_usuario, usuario, token) => {
  try {
    const response = await axiosInstance.put(`/usuarios/${id_usuario}`, usuario, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Devuelve los datos actualizados del usuario
  } catch (error) {
    console.error("Error al actualizar usuario:", error.response ? error.response.data : error.message);
    throw error; // Lanza el error para manejarlo en el componente
  }
};