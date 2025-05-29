const API_URL = "http://localhost:3001/api/v1"; // Base URL de la API

// Obtener el token del localStorage
const obtenerToken = () => {
  return localStorage.getItem("token"); // Obtener el token almacenado
};

// Obtener el id_usuario del localStorage
export const obtenerIdUsuario = () => {
  return localStorage.getItem("idUsuario"); // Retorna como string o null
};

// Obtener el id_cliente del localStorage
export const obtenerIdCliente = () => {
  return localStorage.getItem("idCliente"); // Retorna como string ("" si no hay cliente)
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
export const obtenerDatosBoletaCliente = async (id_cliente) => {
    return await hacerPeticion(`${API_URL}/clientes-boleta/${id_cliente}`);
  };

//Para enviar el codigo de verificacion y verificarlo
export const VerificacionPago = async (codigo) => {
    return await hacerPeticion(`${API_URL}/verificar-pago/,'POST',${codigo}`);
  };

//Para enviar el codigo al correo del cliente obvio el codigo de pago
export const EnviarVerificacionPago = async (email) => {
    return await hacerPeticion(`${API_URL}/clientes-boleta/,'POST',${email}`);
  };

//Para crear la venta y sus detalles tipo que productos y esas cosas
export const CrearVenta = async (datos) => {
    return await hacerPeticion(`${API_URL}/ventas/,'POST',${datos}`);
  };

  
//Estos 2 siguientes son para la tabla :v
//Llamamos a todas la ventas 
export const obtenerVentas = async () => {
    return await hacerPeticion(`${API_URL}/ventas)`);
  };

//Para obtener los detalles de cualquier venta
export const obtenerDetallesVenta = async (id_venta) => {
    return await hacerPeticion(`${API_URL}/ventas-detalle/${id_venta}`);
  };

