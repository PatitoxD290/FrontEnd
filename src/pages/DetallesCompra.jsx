import React, { useState, useEffect } from "react"; 
import { useLocation, useNavigate } from "react-router-dom";
import "../css/styleComprasD.css";
import {
  obtenerCantidadTotalPorGrupos,
  agregarGrupo,
  eliminarGrupo,
  manejarCambioGrupo,
  manejarCambioCampoSimple,
  validarDetallesDeProductos,
  agregarIdProductoAlStorage // <-- Importa la función para guardar en localStorage
} from "../services/DCompraService";

const DetallesCompra = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [detallesPorProducto, setDetallesPorProducto] = useState({});

  useEffect(() => {
    if (location.state?.productos) {
      const productos = location.state.productos;
      setProductosSeleccionados(productos);

      // Guardar los ids de productos en localStorage
      productos.forEach((producto) => {
        agregarIdProductoAlStorage(producto.id_producto);
      });

      const detallesIniciales = {};
      productos.forEach((producto) => {
        detallesIniciales[producto.id] = {
          grupos: producto.cantidad > 1 ? [] : null,
          color: "#ffffff",
          material: "",
          talla: "", // para cantidad 1 sin grupos
        };
      });
      setDetallesPorProducto(detallesIniciales);
    }
  }, [location]);

  // Handlers que usan service.js para actualizar estado
  const agregarGrupoHandler = (productoId) => {
    const detallesActuales = detallesPorProducto[productoId];
    const producto = productosSeleccionados.find((p) => p.id === productoId);

    const resultado = agregarGrupo(detallesActuales, producto.cantidad);
    if (resultado.error) {
      alert("Ya se ha asignado la cantidad total para este producto.");
      return;
    }

    setDetallesPorProducto((prev) => ({
      ...prev,
      [productoId]: resultado,
    }));
  };

  const eliminarGrupoHandler = (productoId, grupoIndex) => {
    const detallesActuales = detallesPorProducto[productoId];
    const resultado = eliminarGrupo(detallesActuales, grupoIndex);

    setDetallesPorProducto((prev) => ({
      ...prev,
      [productoId]: resultado,
    }));
  };

  const manejarCambioGrupoHandler = (productoId, grupoIndex, campo, valor) => {
    const detallesActuales = detallesPorProducto[productoId];
    const resultado = manejarCambioGrupo(detallesActuales, grupoIndex, campo, valor);

    setDetallesPorProducto((prev) => ({
      ...prev,
      [productoId]: resultado,
    }));
  };

  const manejarCambioCampoSimpleHandler = (productoId, campo, valor) => {
    const detallesActuales = detallesPorProducto[productoId];
    const resultado = manejarCambioCampoSimple(detallesActuales, campo, valor);

    setDetallesPorProducto((prev) => ({
      ...prev,
      [productoId]: resultado,
    }));
  };

  // Campos directos que no tienen lógica compleja
  const manejarColorHandler = (productoId, color) => {
    setDetallesPorProducto((prev) => ({
      ...prev,
      [productoId]: {
        ...prev[productoId],
        color,
      },
    }));
  };

  const manejarMaterialHandler = (productoId, material) => {
    setDetallesPorProducto((prev) => ({
      ...prev,
      [productoId]: {
        ...prev[productoId],
        material,
      },
    }));
  };

  const continuar = () => {
    // Validación antes de continuar
    for (const producto of productosSeleccionados) {
      const detalles = detallesPorProducto[producto.id];
      const grupos = detalles.grupos;

      if (producto.cantidad > 1) {
        const cantidadTotal = obtenerCantidadTotalPorGrupos(grupos);
        if (cantidadTotal !== producto.cantidad) {
          alert(
            `La suma de cantidades para el producto "${producto.nombre}" debe ser exactamente ${producto.cantidad}.`
          );
          return;
        }

        for (const grupo of grupos) {
          if (!grupo.talla) {
            alert(
              `Completa la talla en todos los grupos del producto "${producto.nombre}".`
            );
            return;
          }
        }
      } else {
        if (!detalles.talla) {
          alert(`Completa la talla para el producto "${producto.nombre}".`);
          return;
        }
      }

      if (producto.nombre.toLowerCase().includes("polo personalizado")) {
        if (!detalles.color) {
          alert(`Selecciona un color para el producto "${producto.nombre}".`);
          return;
        }
        if (!detalles.material) {
          alert(`Selecciona un material para el producto "${producto.nombre}".`);
          return;
        }
      }
    }

    const datosFinales = {
      productos: productosSeleccionados,
      detalles: detallesPorProducto,
    };
    navigate("/datos-cliente", { state: datosFinales });
  };

  return (
    <div className="detalles-background">
      <h2 className="titulo-compra">Detalles de la Compra</h2>

      {productosSeleccionados.map((producto, index) => {
        const detalles = detallesPorProducto[producto.id] || {
          grupos: producto.cantidad > 1 ? [] : null,
          color: "#ffffff",
          material: "",
          talla: "",
        };
        const grupos = detalles.grupos;

        const esPoloPersonalizado = producto.nombre.toLowerCase().includes("polo personalizado");

        return (
          <div key={index} className="producto-detalle">
            <h3>{producto.nombre}</h3>
            <p>
              <strong>Cantidad:</strong> {producto.cantidad}
            </p>

            {producto.cantidad > 1 ? (
              <div className="grupos-container">
                <h4>Grupos</h4>
                {grupos.map((grupo, idx) => (
                  <div key={idx} className="grupo-item">
                    <label>
                      Talla:
                      <input
                        type="text"
                        value={grupo.talla}
                        onChange={(e) =>
                          manejarCambioGrupoHandler(producto.id, idx, "talla", e.target.value)
                        }
                      />
                    </label>
                    <label>
                      Cantidad:
                      <input
                        type="number"
                        min="1"
                        max={
                          producto.cantidad -
                          obtenerCantidadTotalPorGrupos(grupos) +
                          grupo.cantidad
                        }
                        value={grupo.cantidad}
                        onChange={(e) =>
                          manejarCambioGrupoHandler(
                            producto.id,
                            idx,
                            "cantidad",
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                    </label>
                    <button
                      className="btn-delet-group"
                      onClick={() => eliminarGrupoHandler(producto.id, idx)}
                    >
                      X
                    </button>
                  </div>
                ))}

                <button
                  className="btn-add-group"
                  onClick={() => agregarGrupoHandler(producto.id)}
                >
                  Agregar Grupo
                </button>
              </div>
            ) : (
              <label>
                Talla:
                <input
                  type="text"
                  value={detalles.talla}
                  onChange={(e) =>
                    manejarCambioCampoSimpleHandler(producto.id, "talla", e.target.value)
                  }
                />
              </label>
            )}

            {esPoloPersonalizado && (
              <>
                <label>
                  Color:
                  <input
                    type="color"
                    value={detalles.color}
                    onChange={(e) => manejarColorHandler(producto.id, e.target.value)}
                  />
                </label>
                <label>
                  Material:
                  <input
                    type="text"
                    value={detalles.material}
                    onChange={(e) => manejarMaterialHandler(producto.id, e.target.value)}
                    placeholder="Material (ej. algodón)"
                  />
                </label>
              </>
            )}
          </div>
        );
      })}

      <button className="btn-add-group" onClick={continuar}>
        Continuar con el Pago
      </button>
    </div>
  );
};

export default DetallesCompra;
