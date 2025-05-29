import axios from "axios";

// Base URL de la API
const API_URL = "http://localhost:3001/api/v1";

// Obtener todos los productos del catálogo
export const obtenerCatalogo = async () => {
  try {
    const response = await axios.get(`${API_URL}/productos-catalogo`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los productos del catálogo:", error);
    return [];
  }
};


// Obtener todos los productos con total de stock
export const obtenerStockProducto = async (id_producto) => {
  try {
    const response = await axios.get(`${API_URL}/productos-stock/${id_producto}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el stock del producto:", error);
    return [];
  }
};

// modificar producto
export const modificarProducto = async (id_producto, producto) => {
  try {
    await axios.put(`${API_URL}/productos/${id_producto}`, producto);
  } catch (error) {
    console.error("Error al modificar el producto:", error);
  }
};
