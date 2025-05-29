import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/stylePago.css";
import { useAuth } from "../context/AuthContext";

const Pago = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { productos, total, cliente } = location.state || {
    productos: [],
    total: 0,
    cliente: {},
  };
  const [qrEscaneado, setQrEscaneado] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const procesarPago = async () => {
    if (!user?.id_usuario) {
      alert("Usuario no autenticado");
      return;
    }
    if (!cliente?.direccion || cliente.direccion.trim() === "") {
      alert("Falta la dirección del cliente");
      return;
    }
    if (!Array.isArray(productos) || productos.length === 0) {
      alert("No hay productos para procesar");
      return;
    }
    if (!qrEscaneado) {
      alert("Debes escanear el código QR antes de pagar");
      return;
    }
    if (!cliente?.nombres || cliente.nombres.trim() === "") {
      alert("Faltan los nombres del cliente");
      return;
    }
    if (!cliente?.apellidos || cliente.apellidos.trim() === "") {
      alert("Faltan los apellidos del cliente");
      return;
    }
    if (!cliente?.telefono || cliente.telefono.trim() === "") {
      alert("Falta el número de teléfono del cliente");
      return;
    }

    setProcesando(true);
    try {
      const formData = new FormData();

      // El backend obtiene id_cliente del token, pero sí necesitas enviar direccion
      formData.append("lugar_entrega", cliente.direccion);

      formData.append("total", total);

      const productosConDetalles = productos.map(p => ({
        id: p.id,
        cantidad: p.cantidad,
        precio: p.precio,
        personalizacion: location.state.detalles[p.id] || {}
      }));
      formData.append("productos", JSON.stringify(productosConDetalles));

      productos.forEach((producto) => {
        const detalles = location.state.detalles[producto.id];
        if (detalles && detalles.imagenes && detalles.imagenes.length > 0) {
          detalles.imagenes.forEach((archivo, index) => {
            formData.append(`archivo-${producto.id}-${index}`, archivo);
          });
        }
      });

      const response = await fetch("http://localhost:3001/api/v1/ventas/completa", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // No Content-Type cuando usas FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error al procesar la venta: " + (errorData.message || "Error desconocido"));
        setProcesando(false);
        return;
      }

      alert("Venta realizada con éxito");
      navigate("/gracias");
    } catch (error) {
      console.error(error);
      alert("Error al procesar la venta");
      setProcesando(false);
    }
  };

  return (
    <div className="pagobody">
      <div className="checkout-container">
        {/* Columna Izquierda */}
        <div className="checkout-left">
          <div className="checkout-section">
            <h3>Datos del Cliente</h3>
            <p>
              <strong>Nombres: {cliente?.nombres}</strong> <br />
              <strong>Apellidos: {cliente?.apellidos}</strong> <br />
              <strong>Teléfono: {cliente?.telefono}</strong> <br />
              <strong>Dirección: {cliente?.direccion}</strong>
            </p>
          </div>
          <div className="checkout-section">
            <h3>Método de pago</h3>
            <p>
              {cliente?.metodoPago === "yape"
                ? "📱 Yape/Plin"
                : cliente?.metodoPago === "tarjeta"
                  ? "💳 Tarjeta de Crédito/Débito"
                  : "🏦 Transferencia Bancaria"}
            </p>
          </div>
          <div className="checkout-section">
            <h3>Detalle del artículo</h3>
            {productos.map((p) => (
              <div key={p.id_producto} className="item-detalle">
                <img
                  src={`/Images/ID_Producto=${p.id_producto}.png`}
                  onError={(e) => (e.target.src = "/Images/logo-kym.png")}
                  alt={p.nombre}
                  style={{
                    maxWidth: "120px",
                    maxHeight: "120px",
                    objectFit: "contain",
                    borderRadius: "8px"
                  }}
                  className="img-fluid"
                />

                <div>
                  <p>{p.nombre}</p>
                  <p>PEN {parseFloat(p.precio).toFixed(2)}</p>
                  <p>Cantidad: {p.cantidad}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
        {/* Columna Derecha */}
        <div className="checkout-right">
          <div className="resumen-section">
            <h3>Resumen</h3>
            <div className="resumen-linea">
              <span>Total</span>
              <span>PEN {parseFloat(total).toFixed(2)}</span>
            </div>
            <hr />
            <div className="resumen-linea total">
              <span>Total</span>
              <span>PEN {parseFloat(total).toFixed(2)}</span>
            </div>
            {!qrEscaneado && (
              <button className="btn-qr" onClick={() => setQrEscaneado(true)}>
                Ya escaneé el QR
              </button>
            )}
            <button
              className="btn-pagar"
              disabled={procesando}
              onClick={procesarPago}
            >
              {procesando ? "Procesando..." : "Pagar ahora"}
            </button>
          </div>
          <div className="qr-section">
            <img src="./Images/qrpago.jpg" alt="QR" />
            <p>Escanea con tu billetera favorita</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pago;
