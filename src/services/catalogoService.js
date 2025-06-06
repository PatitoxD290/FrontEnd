import axios from "axios";

// Base URL de la API
const API_URL = "http://localhost:3001/api/v1";

// Obtener todos los productos del catálogo con filtros de género y edad
export const obtenerCatalogo = async (genero, edad) => {
  try {
    let url = `${API_URL}/productos-catalogo`; // URL base

    // Si se pasan filtros, los agregamos a la URL
    if (genero || edad) {
      url += `?genero=${genero || ''}&edad=${edad || ''}`;
    }

    const response = await axios.get(url);
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
