import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/stylePago.css";
import { useAuth } from "../context/AuthContext";
import {
  obtenerDatosBoletaCliente,
  VerificacionPago,
  EnviarVerificacionPago,
  obtenerCorreo,
  CrearVenta
} from "../services/negocio";

const Pago = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { productos = [], cliente = {}, detalles = {} } = location.state || {};

  const [clienteLocal, setClienteLocal] = useState(null);
  const [idsProducto, setIdsProducto] = useState([]);
  const [qrEscaneado, setQrEscaneado] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const [codigoPago, setCodigoPago] = useState("");
  const [codigoVerificado, setCodigoVerificado] = useState(false);
  const [correoUsuario, setCorreoUsuario] = useState("");

  useEffect(() => {
    const idCliente = localStorage.getItem("idCliente");

    if (idCliente && idCliente !== "null") {
      obtenerDatosBoletaCliente(idCliente)
        .then((res) => {
          if (res?.exito && Array.isArray(res.datos) && res.datos.length > 0) {
            setClienteLocal(res.datos[0]);
          } else {
            setClienteLocal(cliente);
          }
        })
        .catch(() => {
          setClienteLocal(cliente);
        });
    } else {
      setClienteLocal(cliente);
    }
  }, [cliente]);

  useEffect(() => {
    const ids = localStorage.getItem("idsProducto");
    if (ids) {
      try {
        setIdsProducto(JSON.parse(ids));
      } catch {
        setIdsProducto([]);
      }
    }
  }, []);

  const subtotal = productos.reduce((acc, producto) => {
    const precio = parseFloat(producto.precio) || 0;
    const cantidad = parseInt(producto.cantidad) || 0;
    return acc + precio * cantidad;
  }, 0);

  const igv = subtotal * 0.05;
  const totalCalculado = subtotal + igv;

  useEffect(() => {
    if (user?.id_usuario) {
      obtenerCorreo(user.id_usuario)
        .then((res) => {
          if (res && res.email) setCorreoUsuario(res.email);
        })
        .catch(() => {
          setCorreoUsuario("");
        });
    }
  }, [user]);

  const enviarCodigoVerificacion = async () => {
    if (!correoUsuario) {
      alert("No se pudo obtener el correo del usuario");
      return;
    }
    try {
      await EnviarVerificacionPago(correoUsuario);
      alert("Código de verificación enviado a tu correo");
    } catch {
      alert("Error al enviar código de verificación");
    }
  };

  const verificarCodigoPago = async () => {
    if (!codigoPago.trim()) {
      alert("Ingresa un código de pago válido");
      return;
    }
    try {
      await VerificacionPago(codigoPago.trim());
      setCodigoVerificado(true);
      alert("Código verificado correctamente");
    } catch {
      setCodigoVerificado(false);
      alert("Código de pago incorrecto");
    }
  };

  const procesarPago = async () => {
    if (!user?.id_usuario) return alert("Usuario no autenticado");
    if (!clienteLocal?.direccion?.trim()) return alert("Falta la dirección del cliente");
    if (!productos.length) return alert("No hay productos para procesar");
    if (!qrEscaneado) return alert("Debes escanear el código QR antes de pagar");
    if (!clienteLocal?.nombres?.trim()) return alert("Faltan los nombres del cliente");
    if (!clienteLocal?.apellidos?.trim()) return alert("Faltan los apellidos del cliente");
    if (!clienteLocal?.dni?.trim()) return alert("Falta el DNI del cliente");
    if (!clienteLocal?.telefono?.trim()) return alert("Falta el número de teléfono del cliente");
    if (!metodoPago) return alert("Debes seleccionar un método de pago");
    if (!codigoVerificado) return alert("Debes verificar el código de pago antes de continuar");

    setProcesando(true);
    try {
      const idCliente = localStorage.getItem("idCliente");
      const venta = {
        id_cliente: idCliente !== "null" ? idCliente : null,
        lugar_entrega: clienteLocal.direccion,
        total: parseFloat(totalCalculado.toFixed(2)),
        forma_pago: metodoPago,
        fecha: new Date().toISOString().slice(0, 10),
        hora: new Date().toISOString().slice(11, 19),
        detalles: productos.map(p => ({
          id_producto: p.id || p.id_producto,
          cantidad: p.cantidad
        }))
      };

      console.log("📤 Enviando venta al backend:", venta);
      await CrearVenta(venta);

      alert("Venta realizada con éxito");
      navigate("/gracias");
    } catch (error) {
      console.error("Error procesando la venta:", error);
      alert("Error al procesar la venta");
    } finally {
      setProcesando(false);
    }
  };

  const handleEscanearQR = () => {
    setQrEscaneado(true);
    enviarCodigoVerificacion();
  };

  return (
    <div className="pagobody">
      <div className="checkout-container">
        <div className="checkout-left">
          <div className="checkout-section">
            <h3>Datos del Cliente</h3>
            <p>
              <strong>Nombres: {clienteLocal?.nombres || "No definido"}</strong><br />
              <strong>Apellidos: {clienteLocal?.apellidos || "No definido"}</strong><br />
              <strong>DNI: {clienteLocal?.dni || "No definido"}</strong><br />
              <strong>Teléfono: {clienteLocal?.telefono || "No definido"}</strong><br />
              <strong>Dirección: {clienteLocal?.direccion || "No definido"}</strong>
            </p>
          </div>

          <div className="checkout-section">
            <h3>Elige método de pago</h3>
            {["yape", "tarjeta", "transferencia"].map((m) => (
              <div key={m}>
                <label>
                  <input
                    type="radio"
                    name="metodoPago"
                    value={m}
                    checked={metodoPago === m}
                    onChange={() => setMetodoPago(m)}
                  />
                  {m === "yape" ? "Plim/Yape" :
                   m === "tarjeta" ? "Tarjeta de Crédito/Débito" : "Transferencia Bancaria"}
                </label>
              </div>
            ))}
          </div>

          <div className="checkout-section">
            <h3>Detalle del artículo</h3>
            {productos.map((p, index) => {
              const idParaImagen = idsProducto[index] || p.id_producto || p.id;
              return (
                <div key={idParaImagen} className="item-detalle">
                  <img
                    src={`/Images/ID_Producto=${idParaImagen}.jpeg`}
                    onError={(e) => (e.target.src = "/Images/logo-kym.png")}
                    alt={p.nombre}
                    style={{ maxWidth: "120px", maxHeight: "120px", objectFit: "contain", borderRadius: "8px" }}
                    className="img-fluid"
                  />
                  <div>
                    <p>{p.nombre}</p>
                    <p>PEN {parseFloat(p.precio).toFixed(2)}</p>
                    <p>Cantidad: {p.cantidad}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="checkout-right">
          <div className="resumen-section">
            <h3>Resumen</h3>
            <div className="resumen-linea">
              <span>Subtotal</span>
              <span>PEN {subtotal.toFixed(2)}</span>
            </div>
            <div className="resumen-linea">
              <span>IGV (5%)</span>
              <span>PEN {igv.toFixed(2)}</span>
            </div>
            <hr />
            <div className="resumen-linea total">
              <span>Total</span>
              <span>PEN {totalCalculado.toFixed(2)}</span>
            </div>

            {!qrEscaneado && (
              <button className="btn-qr" onClick={handleEscanearQR}>
                Escanear código QR
              </button>
            )}

            {qrEscaneado && (
              <div className="codigo-verificacion">
                <input
                  type="number"
                  placeholder="Ingrese código"
                  value={codigoPago}
                  onChange={(e) => setCodigoPago(e.target.value)}
                  disabled={codigoVerificado}
                />
                <button
                  onClick={verificarCodigoPago}
                  disabled={codigoVerificado}
                  className="btn-verificacion"
                >
                  Verificar Código
                </button>
                {codigoVerificado && <p style={{ color: "green" }}>Código verificado ✔️</p>}
              </div>
            )}

            <button
              className="btn-pagar"
              disabled={procesando || !codigoVerificado}
              onClick={procesarPago}
            >
              {procesando ? "Procesando..." : "Pagar ahora"}
            </button>
          </div>
          <div className="qr-section">
            <img
              src="/Images/qrpago.jpg"
              alt="Código QR de pago"
              className="qr-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pago;
