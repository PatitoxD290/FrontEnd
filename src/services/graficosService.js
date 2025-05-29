const API_URL = "http://localhost:3001/api/v1"; // Base URL de la API

// Obtener el token del localStorage
const obtenerToken = () => {
    return localStorage.getItem("token"); // Obtener el token almacenado
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

// Obtener datos de boleta de un cliente
export const obtenerlasventaspormes = async () => {
    return await hacerPeticion(`${API_URL}/ventas-mes`);
  };

// Obtener datos de boleta de un cliente
export const otenerprodutosmasvendidos = async () => {
    return await hacerPeticion(`${API_URL}/ventas-productos-mas-vendidos`);
  };
