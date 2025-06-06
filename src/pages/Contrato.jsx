import React, { useState, useMemo } from "react";
import "../css/styleContrato.css";
import { crearContrato } from "../services/contratoService";

const SolicitudContrato = () => {
  const [cantidadTotal, setCantidadTotal] = useState(5);
  const [material, setMaterial] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [grupos, setGrupos] = useState([
    { talla: "", cantidad: 1, nombre: "", numero: "" },
  ]);

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
      { talla: "", cantidad: 1, nombre: "", numero: "" },
    ]);
  };

  const manejarCambioGrupo = (index, campo, valor) => {
    const nuevosGrupos = [...grupos];
    nuevosGrupos[index][campo] =
      campo === "cantidad" ? Number(valor) : valor;
    setGrupos(nuevosGrupos);
  };

  const manejarArchivo = (e) => {
    setArchivo(e.target.files[0]);
  };

  const calcularPrecio = useMemo(() => {
    const preciosMaterial = {
      "Algodón": 5,
      "Poliéster": 9,
      "Mixto": 12,
    };

    const multiplicadoresTalla = {
      niños: 1,
      jóvenes: 1.2,
      adultos: 1.5,
    };

    let total = 0;

    grupos.forEach((grupo) => {
      const talla = grupo.talla;
      const cantidad = Number(grupo.cantidad || 0);

      let tipo = "";
      if (["12", "14", "16"].includes(talla)) tipo = "niños";
      else if (["S", "M", "L"].includes(talla)) tipo = "jóvenes";
      else if (["XL", "XXL", "XXXL"].includes(talla)) tipo = "adultos";
      else tipo = "jóvenes";

      const base = preciosMaterial[material] || 0;
      const mult = multiplicadoresTalla[tipo] || 1;

      total += cantidad * base * mult;
    });

    return total.toFixed(2);
  }, [material, grupos]);

  const enviarFormulario = async () => {
    const total = obtenerCantidadActual();
    if (total !== cantidadTotal) {
      alert(`La suma de las cantidades debe ser exactamente ${cantidadTotal}. Actualmente tienes ${total}.`);
      return;
    }

    try {
      await crearContrato({ material, grupos, archivo, valorEstimado: calcularPrecio });
      alert("Contrato enviado correctamente");
    } catch (error) {
      alert("Error al enviar contrato: " + error.message);
    }
  };

  return (
    <div className="sc-formulario">
      <h2 className="sc-titulo">Solicitud de Contrato</h2>

      <div className="sc-form-group">
        <label className="sc-form-label">Material:</label>
        <select
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          className="sc-select"
        >
          <option value="" disabled hidden>
            Seleccione un material
          </option>
          <option value="Algodón">Algodón</option>
          <option value="Poliéster">Poliéster</option>
          <option value="Mixto">Mixto</option>
        </select>
      </div>

      <div className="sc-form-group">
        <label className="sc-form-label">Archivo de referencia:</label>
        <input
          type="file"
          accept="image/*"
          name="referencia_diseño"
          onChange={manejarArchivo}
          className="sc-input"
        />
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

      <h3 className="sc-subtitulo">Grupos de Personalización</h3>
      {grupos.map((grupo, index) => (
        <div key={index} className="sc-personalizacion-item">
          <div className="sc-form-group">
            <label className="sc-form-label">Cantidad:</label>
            <input
              type="number"
              min="1"
              value={grupo.cantidad}
              onChange={(e) =>
                manejarCambioGrupo(index, "cantidad", e.target.value)
              }
              className="sc-input"
            />
          </div>

          <div className="sc-form-group">
            <label className="sc-form-label">Talla:</label>
            <select
              value={grupo.talla}
              onChange={(e) => manejarCambioGrupo(index, "talla", e.target.value)}
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
            <label className="sc-form-label">Nombres (uno por línea):</label>
            <textarea
              rows={grupo.cantidad}
              value={grupo.nombre}
              onChange={(e) => manejarCambioGrupo(index, "nombre", e.target.value)}
              className="sc-textarea"
              placeholder="Ej: Juan Pérez&#10;María López"
            />
          </div>

          <div className="sc-form-group">
            <label className="sc-form-label">Números (uno por línea):</label>
            <textarea
              rows={grupo.cantidad}
              value={grupo.numero}
              onChange={(e) => manejarCambioGrupo(index, "numero", e.target.value)}
              className="sc-textarea"
              placeholder="Ej: 10&#10;23"
            />
          </div>

          <hr className="sc-hr" />
        </div>
      ))}

      <button onClick={agregarGrupo} className="sc-btn-secondary">
        + Agregar grupo
      </button>

      <br />

      <div className="sc-form-group">
        <label className="sc-form-label">
          Valor aproximado: {calcularPrecio} So
        </label>
      </div>

      <button onClick={enviarFormulario} className="sc-btn-primary">
        Enviar Solicitud
      </button>
    </div>
  );
};

export default SolicitudContrato;
