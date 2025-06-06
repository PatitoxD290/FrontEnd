// =======================
// LocalStorage helpers
// =======================

export const obtenerIdCliente = () => {
  const idCliente = localStorage.getItem("idCliente");
  return idCliente && idCliente !== "" ? idCliente : null;
};

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

  if (campo === "cantidad") {
    const sumaSinEste = nuevosGrupos.reduce((total, grupo, idx) => {
      return idx !== grupoIndex ? total + grupo.cantidad : total;
    }, 0);

    const maxPermitido = detallesProducto.cantidad || Infinity; // Por si lo agregás luego
    const nuevaCantidad = parseInt(valor) || 1;

    if (sumaSinEste + nuevaCantidad > maxPermitido) {
      // Si te pasás, quedate con el valor anterior
      return detallesProducto;
    }
  }

  nuevosGrupos[grupoIndex] = {
    ...nuevosGrupos[grupoIndex],
    [campo]: valor,
  };

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

const concatenarTallas = (producto, detalles) => {
  if (producto.cantidad > 1) {
    const grupos = detalles.grupos || [];

    return grupos
      .map((grupo) => {
        const t = grupo.talla?.trim().toUpperCase();

        // Validar que hay una talla definida
        if (!t) return "";

        // Formato: 2-M o solo M si cantidad = 1
        return grupo.cantidad > 1 ? `${grupo.cantidad}-${t}` : t;
      })
      .filter((val) => val !== "") // Eliminar entradas vacías por seguridad
      .join(", ");
  } else {
    return detalles.talla?.trim().toUpperCase() || "";
  }
};



const validarDetallesDeProductos = (productosSeleccionados, detallesPorProducto) => {
  for (const producto of productosSeleccionados) {
    const detalles = detallesPorProducto[producto.id];

    agregarIdProductoAlStorage(producto.id);

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
  }

  
  return null;
};

export {
  obtenerCantidadTotalPorGrupos,
  agregarGrupo,
  eliminarGrupo,
  manejarCambioGrupo,
  manejarCambioCampoSimple,
  validarDetallesDeProductos,
  agregarIdProductoAlStorage,
  concatenarTallas,
};
