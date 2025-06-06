import React, { useState } from "react";
import "../css/styleContrato.css";

const productosDisponibles = [
  { id: 1, nombre: "Polo Deportivo" },
  { id: 2, nombre: "Camisa Formal" },
  { id: 3, nombre: "Chaqueta Escolar" },
];

const SolicitudContrato = () => {
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidadTotal, setCantidadTotal] = useState(5); // Define el total máximo a repartir entre grupos
  const [grupos, setGrupos] = useState([
    { talla: "", material: "", cantidad: 1, nombre: "", numero: "", archivo: null },
  ]);

  const manejarCambioProducto = (e) => {
    setProductoSeleccionado(e.target.value);
    setGrupos([
      { talla: "", material: "", cantidad: 1, nombre: "", numero: "", archivo: null },
    ]);
  };

  const obtenerCantidadActual = () =>
    grupos.reduce((total, g) => total + Number(g.cantidad || 0), 0);

  const agregarGrupo = () => {
    const cantidadActual = obtenerCantidadActual();
    if (cantidadActual >= cantidadTotal) {
      alert("Ya se ha asignado la cantidad total permitida.");
      return;
    }
    setGrupos([
      ...grupos,
      { talla: "", material: "", cantidad: 1, nombre: "", numero: "", archivo: null },
    ]);
  };

  const manejarCambioGrupo = (index, campo, valor) => {
    const nuevosGrupos = [...grupos];
    nuevosGrupos[index][campo] = valor;
    setGrupos(nuevosGrupos);
  };

  const manejarArchivo = (index, archivo) => {
    const nuevosGrupos = [...grupos];
    nuevosGrupos[index].archivo = archivo;
    setGrupos(nuevosGrupos);
  };

  const enviarFormulario = () => {
    const total = obtenerCantidadActual();
    if (total !== cantidadTotal) {
      alert(`La cantidad total asignada debe ser exactamente ${cantidadTotal}.`);
      return;
    }
    console.log("Producto:", productoSeleccionado);
    console.log("Grupos:", grupos);
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

      <div className="sc-form-group">
        <label className="sc-form-label">Cantidad total a producir:</label>
        <input
          type="number"
          min="1"
          value={cantidadTotal}
          onChange={(e) => setCantidadTotal(Number(e.target.value))}
          className="sc-input"
        />
      </div>

      {productoSeleccionado && (
        <>
          <h3 className="sc-subtitulo">Grupos de Personalización</h3>
          {grupos.map((grupo, index) => (
            <div key={index} className="sc-personalizacion-item">
              {/* CANTIDAD */}
              <div className="sc-form-group">
                <label className="sc-form-label">Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  value={grupo.cantidad}
                  onChange={(e) =>
                    manejarCambioGrupo(index, "cantidad", parseInt(e.target.value))
                  }
                  className="sc-input"
                />
              </div>

              {/* TALLA */}
              <div className="sc-form-group">
                <label className="sc-form-label">Talla:</label>
                <select
                  value={grupo.talla}
                  onChange={(e) => manejarCambioGrupo(index, "talla", e.target.value)}
                  className="sc-select"
                >
                  <option value="" disabled hidden>Seleccione una talla</option>
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

              {/* MATERIAL */}
              <div className="sc-form-group">
                <label className="sc-form-label">Material:</label>
                <select
                  value={grupo.material}
                  onChange={(e) => manejarCambioGrupo(index, "material", e.target.value)}
                  className="sc-select"
                >
                  <option value="" disabled hidden>Seleccione un material</option>
                  <option value="Algodón">Algodón</option>
                  <option value="Poliéster">Poliéster</option>
                  <option value="Mixto">Mixto</option>
                </select>
              </div>

              {/* OPCIONAL: Nombre y número para polos */}
              {productoSeleccionado.toLowerCase().includes("polo") && (
                <>
                  <div className="sc-form-group">
                    <label className="sc-form-label">Nombre (Personalización):</label>
                    <input
                      type="text"
                      value={grupo.nombre}
                      onChange={(e) =>
                        manejarCambioGrupo(index, "nombre", e.target.value)
                      }
                      className="sc-input"
                    />
                  </div>

                  <div className="sc-form-group">
                    <label className="sc-form-label">Número:</label>
                    <input
                      type="text"
                      value={grupo.numero}
                      onChange={(e) =>
                        manejarCambioGrupo(index, "numero", e.target.value)
                      }
                      className="sc-input"
                    />
                  </div>
                </>
              )}

              {/* ARCHIVO */}
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

          <button onClick={agregarGrupo} className="sc-btn-secondary">
            + Agregar grupo
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
