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
  obtenerIdCliente,
  concatenarTallas,
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

      const detallesIniciales = {};
      productos.forEach((producto) => {
        detallesIniciales[producto.id] = {
          grupos: producto.cantidad > 1 ? [] : null,
          talla: "",
        };
      });
      setDetallesPorProducto(detallesIniciales);
    }
  }, [location]);

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
    const resultado = manejarCambioGrupo(
      detallesActuales,
      grupoIndex,
      campo,
      valor
    );

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

  const construirDatosFinales = () => {
    const productosConTallasConcatenadas = productosSeleccionados.map(
      (producto) => {
        const detalles = detallesPorProducto[producto.id];
        const tallas = concatenarTallas(producto, detalles);
        return {
          ...producto,
          tallas,
        };
      }
    );

    return {
      productos: productosConTallasConcatenadas,
      detalles: detallesPorProducto,
    };
  };

  const continuar = () => {
    const error = validarDetallesDeProductos(
      productosSeleccionados,
      detallesPorProducto
    );
    if (error) {
      alert(error);
      return;
    }

    const datosFinales = construirDatosFinales();
    console.log("🔍 Datos que se enviarán:", datosFinales); // ← Aquí se imprime en consola

    const idCliente = obtenerIdCliente();
    if (idCliente && idCliente !== "null" && idCliente !== "") {
      navigate("/pago", { state: datosFinales });
    } else {
      navigate("/datos-cliente", { state: datosFinales });
    }
  };

  const mostrarDatosEnConsola = () => {
    const datosFinales = construirDatosFinales();
    console.log("📦 Datos simulados antes de continuar:", datosFinales);
  };

  return (
    <div className="detalles-background">
      <h2 className="titulo-compra">DETALLES DE LA COMPRA</h2>

      {productosSeleccionados.map((producto, index) => {
        const detalles = detallesPorProducto[producto.id] || {
          grupos: producto.cantidad > 1 ? [] : null,
          talla: "",
        };
        const grupos = detalles.grupos;

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
                    <div className="form-group">
                      <label>Tallas Chicas:</label>
                      <select
                        value={
                          ["12", "14", "16"].includes(grupo.talla)
                            ? grupo.talla
                            : ""
                        }
                        onChange={(e) =>
                          manejarCambioGrupoHandler(
                            producto.id,
                            idx,
                            "talla",
                            e.target.value
                          )
                        }
                        className="input-formal"
                      >
                        <option value="" disabled hidden>
                          Seleccionar
                        </option>

                        <option value="12">12</option>
                        <option value="14">14</option>
                        <option value="16">16</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Tallas Medianas:</label>
                      <select
                        value={
                          ["S", "M", "L"].includes(grupo.talla)
                            ? grupo.talla
                            : ""
                        }
                        onChange={(e) =>
                          manejarCambioGrupoHandler(
                            producto.id,
                            idx,
                            "talla",
                            e.target.value
                          )
                        }
                        className="input-formal"
                      >
                        <option value="" disabled hidden>
                          Seleccionar
                        </option>

                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Tallas Grandes:</label>
                      <select
                        value={
                          ["XL", "XXL", "XXXL"].includes(grupo.talla)
                            ? grupo.talla
                            : ""
                        }
                        onChange={(e) =>
                          manejarCambioGrupoHandler(
                            producto.id,
                            idx,
                            "talla",
                            e.target.value
                          )
                        }
                        className="input-formal"
                      >
                        <option value="" disabled hidden>
                          Seleccionar
                        </option>

                        <option value="XL">XL</option>
                        <option value="XXL">XXL</option>
                        <option value="XXXL">XXXL</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Cantidad:</label>
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
                        className="input-formal"
                      />
                    </div>
                    <button
                      className="btn-delete btn-small"
                      onClick={() => eliminarGrupoHandler(producto.id, idx)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <button
                  className="btn-primary btn-small"
                  onClick={() => agregarGrupoHandler(producto.id)}
                >
                  + Agregar Grupo
                </button>
              </div>
            ) : (
              // SOLO 1 CANTIDAD: también separado en 3 selects
              <div>
                {/* NIÑOS */}
                <div className="form-group">
                  <label>Tallas Pequeñas:</label>
                  <select
                    value={
                      ["12", "14", "16"].includes(detalles.talla)
                        ? detalles.talla
                        : ""
                    }
                    onChange={(e) =>
                      manejarCambioCampoSimpleHandler(
                        producto.id,
                        "talla",
                        e.target.value
                      )
                    }
                    className="input-formal"
                  >
                    <option value="" disabled hidden>
                      Seleccionar
                    </option>

                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                  </select>
                </div>

                {/* JÓVENES */}
                <div className="form-group">
                  <label>Tallas Medianas:</label>
                  <select
                    value={
                      ["S", "M", "L"].includes(detalles.talla)
                        ? detalles.talla
                        : ""
                    }
                    onChange={(e) =>
                      manejarCambioCampoSimpleHandler(
                        producto.id,
                        "talla",
                        e.target.value
                      )
                    }
                    className="input-formal"
                  >
                    <option value="" disabled hidden>
                      Seleccionar
                    </option>

                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                  </select>
                </div>

                {/* ADULTOS */}
                <div className="form-group">
                  <label>Tallas Grandes:</label>
                  <select
                    value={
                      ["XL", "XXL", "XXXL"].includes(detalles.talla)
                        ? detalles.talla
                        : ""
                    }
                    onChange={(e) =>
                      manejarCambioCampoSimpleHandler(
                        producto.id,
                        "talla",
                        e.target.value
                      )
                    }
                    className="input-formal"
                  >
                    <option value="" disabled hidden>
                      {" "}
                      Seleccionar{" "}
                    </option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="XXXL">XXXL</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="botones-detalles">
        <button className="btn-primary" onClick={continuar}>
          Continuar con el Pago
        </button>

        {/* <button className="btn-primary" onClick={mostrarDatosEnConsola}>
          Mostrar datos por consola
        </button> */} 
      </div>
    </div>
  );
};

export default DetallesCompra;
