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

// Función para crear un contrato
export const crearContrato = async ({ material, grupos, archivo }) => {
  const token = obtenerToken();
  const id_usuario = obtenerIdUsuario();
  const estado = "Pendiente";
  const fecha_inicio = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD

  // Armar la descripción a partir de los grupos
  const descripcion = grupos.map((grupo, index) => {
    const nombres = grupo.nombre.split("\n").filter(Boolean);
    const numeros = grupo.numero.split("\n").filter(Boolean);
    const pares = nombres.map((nombre, i) => `${nombre} (#${numeros[i] || "?"})`);

    return `Grupo ${index + 1} - Talla: ${grupo.talla}, Cantidad: ${grupo.cantidad}, ` +
           `Personalización: ${pares.join(", ")}`;
  }).join(" | ");

  console.log(archivo);  // Verifica que el archivo no sea null o undefined
  // Armar el form data
  const formData = new FormData();
  formData.append("descripcion", `Material: ${material} | ${descripcion}`);
  formData.append("id_usuario", id_usuario);
  formData.append("estado", estado);
  formData.append("fecha_inicio", fecha_inicio);
  if (archivo) {
    formData.append("referencia_diseño", archivo);
  }

  try {
    const respuesta = await fetch(`${API_URL}/contratos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return await manejarRespuesta(respuesta);
  } catch (error) {
    console.error("Error al crear contrato:", error.message);
    throw error;
  }
};
