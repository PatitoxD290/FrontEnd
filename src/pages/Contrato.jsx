import React, { useState } from "react";
import "../css/styleContrato.css";

const productosDisponibles = [
  { id: 1, nombre: "Polo Deportivo" },
  { id: 2, nombre: "Camisa Formal" },
  { id: 3, nombre: "Chaqueta Escolar" },
];

const SolicitudContrato = () => {
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [personalizaciones, setPersonalizaciones] = useState([
    { talla: "", cantidad: 1, nombre: "", numero: "", archivo: null },
  ]);

  const manejarCambioProducto = (e) => {
    setProductoSeleccionado(e.target.value);
    setPersonalizaciones([
      { talla: "", cantidad: 1, nombre: "", numero: "", archivo: null },
    ]);
  };

  const agregarPersonalizacion = () => {
    setPersonalizaciones([
      ...personalizaciones,
      { talla: "", cantidad: 1, nombre: "", numero: "", archivo: null },
    ]);
  };

  const manejarCambioPersonalizacion = (index, campo, valor) => {
    const nuevas = [...personalizaciones];
    nuevas[index][campo] = valor;
    setPersonalizaciones(nuevas);
  };

  const manejarArchivo = (index, archivo) => {
    const nuevas = [...personalizaciones];
    nuevas[index].archivo = archivo;
    setPersonalizaciones(nuevas);
  };

  const enviarFormulario = () => {
    console.log("Producto:", productoSeleccionado);
    console.log("Personalizaciones:", personalizaciones);
    alert("Solicitud de contrato enviada (ver consola para detalles)");
  };

  return (
    <div className="sc-formulario">
      <h2 className="sc-titulo">Solicitud de Contrato</h2>

      <div className="sc-form-group">
        <label className="sc-form-label">Producto:</label>
        <select
          value={productoSeleccionado}
          onChange={manejarCambioProducto}
          className="sc-select"
        >
          <option value="" disabled hidden>
            Seleccione un producto
          </option>
          {productosDisponibles.map((p) => (
            <option key={p.id} value={p.nombre}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>

      {productoSeleccionado && (
        <>
          <h3 className="sc-subtitulo">Personalización</h3>
          {personalizaciones.map((p, index) => (
            <div key={index} className="sc-personalizacion-item">
              <div className="sc-form-group">
                <label className="sc-form-label">Talla:</label>
                <select
                  value={p.talla}
                  onChange={(e) =>
                    manejarCambioPersonalizacion(index, "talla", e.target.value)
                  }
                  className="sc-select"
                >
                  <option value="" disabled hidden>
                    Seleccione una talla
                  </option>
                  <optgroup label="Niños">
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                  </optgroup>
                  <optgroup label="Jóvenes">
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                  </optgroup>
                  <optgroup label="Adultos">
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="XXXL">XXXL</option>
                  </optgroup>
                </select>
              </div>

              <div className="sc-form-group">
                <label className="sc-form-label">Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  value={p.cantidad}
                  onChange={(e) =>
                    manejarCambioPersonalizacion(
                      index,
                      "cantidad",
                      parseInt(e.target.value)
                    )
                  }
                  className="sc-input"
                />
              </div>

              {productoSeleccionado.toLowerCase().includes("polo") && (
                <>
                  <div className="sc-form-group">
                    <label className="sc-form-label">
                      Nombre (Personalización):
                    </label>
                    <input
                      type="text"
                      value={p.nombre}
                      onChange={(e) =>
                        manejarCambioPersonalizacion(
                          index,
                          "nombre",
                          e.target.value
                        )
                      }
                      className="sc-input"
                    />
                  </div>

                  <div className="sc-form-group">
                    <label className="sc-form-label">Número:</label>
                    <input
                      type="text"
                      value={p.numero}
                      onChange={(e) =>
                        manejarCambioPersonalizacion(
                          index,
                          "numero",
                          e.target.value
                        )
                      }
                      className="sc-input"
                    />
                  </div>
                </>
              )}

              <div className="sc-form-group">
                <label className="sc-form-label">Archivo de referencia:</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => manejarArchivo(index, e.target.files[0])}
                  className="sc-input"
                />
              </div>

              <hr className="sc-hr" />
            </div>
          ))}

          <button onClick={agregarPersonalizacion} className="sc-btn-secondary">
            + Agregar otra personalización
          </button>

          <br />

          <button onClick={enviarFormulario} className="sc-btn-primary">
            Enviar Solicitud
          </button>
        </>
      )}
    </div>
  );
};

export default SolicitudContrato;
