import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import "../css/Dashboard.css";
import {
  obtenerlasventaspormes,
  otenerprodutosmasvendidos,
  obtenerVentas,
  obtenerDetallesVenta,
} from "../services/graficosService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [ventasPorMes, setVentasPorMes] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [ventasList, setVentasList] = useState([]);
  const [error, setError] = useState(null);

  const [detalleModal, setDetalleModal] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  useEffect(() => {
    obtenerlasventaspormes()
      .then(setVentasPorMes)
      .catch((e) => setError(e.message));

    otenerprodutosmasvendidos()
      .then(setProductosMasVendidos)
      .catch((e) => setError(e.message));

    obtenerVentas()
      .then(setVentasList)
      .catch((e) => setError(e.message));
  }, []);

  const dataVentasMes = {
    labels: ventasPorMes.map((v) => `Mes ${v.mes}`),
    datasets: [
      {
        label: "Ventas por mes",
        data: ventasPorMes.map((v) => v.total),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const opcionesVentasMes = {
    responsive: true,
    scales: {
      y: { beginAtZero: true },
    },
  };

  const dataProductos = {
    labels: productosMasVendidos.map((p) => p.producto),
    datasets: [
      {
        label: "Productos más vendidos",
        data: productosMasVendidos.map((p) => p.cantidad_total),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8AC926",
          "#FF595E",
          "#1982C4",
          "#6A4C93",
        ],
      },
    ],
  };

  const mostrarDetalles = async (id_ventas) => {
    setLoadingDetalle(true);
    setDetalleModal(null);

    try {
      const res = await obtenerDetallesVenta(id_ventas);
      setDetalleModal(res.detalle);
    } catch (e) {
      setError("Error al cargar detalles: " + e.message);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const cerrarModal = () => setDetalleModal(null);

  return (
    <div className="body">
      <h2>Dashboard de Ventas</h2>

      {error && <p className="error-msg">Error cargando datos: {error}</p>}

      <section className="admin-table-container">
        <h3>Lista de Ventas</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>ID Cliente</th>
              <th>Lugar Entrega</th>
              <th>Total</th>
              <th>Forma de Pago</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventasList.map((venta) => (
              <tr key={venta.id_ventas}>
                <td>{venta.id_ventas}</td>
                <td>{venta.id_cliente}</td>
                <td>{venta.lugar_entrega}</td>
                <td>{venta.total}</td>
                <td>{venta.forma_pago}</td>
                <td>{venta.fecha}</td>
                <td>{venta.hora}</td>
                <td>
                  <button
                    className="btn-details"
                    onClick={() => mostrarDetalles(venta.id_ventas)}
                  >
                    Mostrar Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Modal */}
      {detalleModal !== null && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Detalles de la Venta</h3>
            {loadingDetalle ? (
              <p>Cargando...</p>
            ) : (
              <pre style={{ whiteSpace: "pre-wrap" }}>{detalleModal}</pre>
            )}
            <button onClick={cerrarModal} className="btn-details">
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="graficos-container">
        <section>
          <h3>Ventas por mes</h3>
          <Bar data={dataVentasMes} options={opcionesVentasMes} />
        </section>

        <section>
          <h3>Productos más vendidos</h3>
          <Pie data={dataProductos} />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
