// =======================
// LocalStorage helpers
// =======================

const agregarIdProductoAlStorage = (idProducto) => {
    const ids = JSON.parse(localStorage.getItem("idsProducto")) || [];
  
    if (!ids.includes(idProducto)) {
      ids.push(idProducto);
      localStorage.setItem("idsProducto", JSON.stringify(ids));
    }
  };
  
  const obtenerCantidadTotalPorGrupos = (grupos) => {
    return grupos.reduce((total, grupo) => total + grupo.cantidad, 0);
  };
  
  const agregarGrupo = (detallesProducto, cantidadTotal) => {
    const totalCantidadActual = obtenerCantidadTotalPorGrupos(detallesProducto.grupos);
  
    if (totalCantidadActual >= cantidadTotal) {
      return { error: "Cantidad total asignada" };
    }
  
    return {
      ...detallesProducto,
      grupos: [...detallesProducto.grupos, { talla: "", cantidad: 1 }],
    };
  };
  
  const eliminarGrupo = (detallesProducto, grupoIndex) => {
    const nuevosGrupos = [...detallesProducto.grupos];
    nuevosGrupos.splice(grupoIndex, 1);
  
    return {
      ...detallesProducto,
      grupos: nuevosGrupos,
    };
  };
  
  const manejarCambioGrupo = (detallesProducto, grupoIndex, campo, valor) => {
    const nuevosGrupos = [...detallesProducto.grupos];
    nuevosGrupos[grupoIndex] = { ...nuevosGrupos[grupoIndex], [campo]: valor };
  
    return {
      ...detallesProducto,
      grupos: nuevosGrupos,
    };
  };
  
  const manejarCambioCampoSimple = (detallesProducto, campo, valor) => {
    return {
      ...detallesProducto,
      [campo]: valor,
    };
  };
  
  const validarDetallesDeProductos = (productosSeleccionados, detallesPorProducto) => {
    for (const producto of productosSeleccionados) {
      const detalles = detallesPorProducto[producto.id];
  
      // Guardar el id_producto en localStorage
      agregarIdProductoAlStorage(producto.id_producto); // Aquí se almacena automáticamente
  
      const grupos = detalles.grupos;
  
      if (producto.cantidad > 1) {
        const cantidadTotal = obtenerCantidadTotalPorGrupos(grupos);
        if (cantidadTotal !== producto.cantidad) {
          return `La suma de cantidades para el producto "${producto.nombre}" debe ser exactamente ${producto.cantidad}.`;
        }
  
        for (const grupo of grupos) {
          if (!grupo.talla) {
            return `Completa la talla en todos los grupos del producto "${producto.nombre}".`;
          }
        }
      } else {
        if (!detalles.talla) {
          return `Completa la talla para el producto "${producto.nombre}".`;
        }
      }
  
      if (producto.nombre.toLowerCase().includes("polo personalizado")) {
        if (!detalles.color) {
          return `Selecciona un color para el producto "${producto.nombre}".`;
        }
        if (!detalles.material) {
          return `Selecciona un material para el producto "${producto.nombre}".`;
        }
      }
    }
  
    return null; // No hay errores
  };
  
  export {
    obtenerCantidadTotalPorGrupos,
    agregarGrupo,
    eliminarGrupo,
    manejarCambioGrupo,
    manejarCambioCampoSimple,
    validarDetallesDeProductos,
    agregarIdProductoAlStorage
  };
  