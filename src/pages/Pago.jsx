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
    if (!user?.id_usuario) {
      alert("Usuario no autenticado");
      return;
    }
    if (!clienteLocal?.direccion?.trim()) {
      alert("Falta la dirección del cliente");
      return;
    }
    if (!productos.length) {
      alert("No hay productos para procesar");
      return;
    }
    if (!qrEscaneado) {
      alert("Debes escanear el código QR antes de pagar");
      return;
    }
    if (!clienteLocal?.nombres?.trim()) {
      alert("Faltan los nombres del cliente");
      return;
    }
    if (!clienteLocal?.apellidos?.trim()) {
      alert("Faltan los apellidos del cliente");
      return;
    }
    if (!clienteLocal?.dni?.trim()) {
      alert("Falta el DNI del cliente");
      return;
    }
    if (!clienteLocal?.telefono?.trim()) {
      alert("Falta el número de teléfono del cliente");
      return;
    }
    if (!metodoPago) {
      alert("Debes seleccionar un método de pago");
      return;
    }
    if (!codigoVerificado) {
      alert("Debes verificar el código de pago antes de continuar");
      return;
    }

    setProcesando(true);
    try {
      const formData = new FormData();

      const idCliente = localStorage.getItem("idCliente") || "null";

      formData.append("id_cliente", idCliente);
      formData.append("lugar_entrega", clienteLocal.direccion);
      formData.append("total", totalCalculado.toFixed(2));
      formData.append("forma_pago", metodoPago);
      formData.append("fecha", new Date().toISOString().slice(0, 10));
      formData.append("hora", new Date().toISOString().slice(11, 19));

      const detallesParaBackend = productos.map((p) => ({
        id_producto: p.id || p.id_producto,
        cantidad: p.cantidad,
      }));

      formData.append("detalles", JSON.stringify(detallesParaBackend));

      // Solo los datos de los productos, sin imágenes
      productos.forEach((producto) => {
        const det = detalles?.[producto.id];
        // Si hubiese imágenes asociadas, se añadirían aquí (en este caso no lo hacemos)
        // Pero este ejemplo no las envía, ya que no son necesarias para el backend
      });

      console.log("🔍 Datos enviados al backend:");
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: [Archivo] ${pair[1].name}`);
        } else {
          console.log(`${pair[0]}:`, pair[1]);
        }
      }

      await CrearVenta(formData);

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
            <div>
              <label>
                <input
                  type="radio"
                  name="metodoPago"
                  value="yape"
                  checked={metodoPago === "yape"}
                  onChange={() => setMetodoPago("yape")}
                />
                Plim/Yape
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="metodoPago"
                  value="tarjeta"
                  checked={metodoPago === "tarjeta"}
                  onChange={() => setMetodoPago("tarjeta")}
                />
                Tarjeta de Crédito/Débito
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="metodoPago"
                  value="transferencia"
                  checked={metodoPago === "transferencia"}
                  onChange={() => setMetodoPago("transferencia")}
                />
                Transferencia Bancaria
              </label>
            </div>
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
                    style={{
                      maxWidth: "120px",
                      maxHeight: "120px",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
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
                {codigoVerificado && (
                  <p style={{ color: "green" }}>Código verificado ✔️</p>
                )}
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
