import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  // NUEVO: modal para previsualizar PDF
  const [pdfPreview, setPdfPreview] = useState(null);

  // PAGINACION
  const [paginaActual, setPaginaActual] = useState(1);
  const ventasPorPagina = 10;

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

  // ------------------------------------------------
  // Función para crear el PDF bonito y abrir modal preview
  const generarReporteVentas = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });

    doc.setFontSize(22);
    doc.setTextColor("#333");
    doc.text("Reporte de Ventas", 40, 40);

    const headers = [
      "ID Venta",
      "Cliente",
      "Lugar Entrega",
      "Total",
      "Forma Pago",
      "Fecha",
      "Hora",
    ];

    const data = ventasList.map((venta) => [
      venta.id_ventas,
      venta.id_cliente,
      venta.lugar_entrega,
      venta.total,
      venta.forma_pago,
      venta.fecha,
      venta.hora,
    ]);

    // Usa autoTable así:
    autoTable(doc, {
      head: [headers],
      body: data,
      startY: 60,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [116, 0, 0], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 40, right: 40 },
    });

    const pdfBase64 = doc.output("datauristring");
    setPdfPreview(pdfBase64);
  };

  // ------------------------------------------------

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

  const indexUltimaVenta = paginaActual * ventasPorPagina;
  const indexPrimeraVenta = indexUltimaVenta - ventasPorPagina;
  const ventasPaginadas = ventasList.slice(indexPrimeraVenta, indexUltimaVenta);

  const totalPaginas = Math.ceil(ventasList.length / ventasPorPagina);

  return (
    <div className="body-dashboard">
      <button onClick={generarReporteVentas} className="btn-report">
        Reporte Ventas (PDF)
      </button>
      {error && <p className="error-msg">Error cargando datos: {error}</p>}

      <section className="admin-table-container">
        <h3>Lista de Ventas</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Venta</th>
              <th>Cliente</th>
              <th>Lugar Entrega</th>
              <th>Total</th>
              <th>Forma de Pago</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventasPaginadas.map((venta) => (
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

      {/* PAGINACION */}
      <div className="paginacion">
        <button
          disabled={paginaActual === 1}
          onClick={() => setPaginaActual(paginaActual - 1)}
        >
          Anterior
        </button>

        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={paginaActual === num ? "activo" : ""}
            onClick={() => setPaginaActual(num)}
          >
            {num}
          </button>
        ))}

        <button
          disabled={paginaActual === totalPaginas}
          onClick={() => setPaginaActual(paginaActual + 1)}
        >
          Siguiente
        </button>
      </div>

      {/* Modal Detalle Venta */}
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

      {/* Modal Preview PDF */}
      {pdfPreview && (
        <div
          className="modal-overlay-preview"
          onClick={() => setPdfPreview(null)} // Cierra modal al click fuera
        >
          <div
            className="modal-content-preview"
            onClick={(e) => e.stopPropagation()} // Evita cerrar modal al click dentro
          >
            <div className="modal-header-preview">
              <h3>Preview Reporte de Ventas</h3>
              <button
                className="btn-close-preview"
                onClick={() => setPdfPreview(null)} // Botón cerrar modal
                aria-label="Cerrar"
              >
                &times;
              </button>
            </div>
            <div className="modal-body-preview">
              <iframe
                title="Vista previa PDF"
                src={pdfPreview} // Aquí muestra el PDF base64
                frameBorder="0"
                width="100%"
                height="600px"
              />
            </div>
            <div className="modal-footer-preview">
              <button
                className="btn-download"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = pdfPreview;
                  link.download = "ReporteVentas.pdf";
                  link.click();
                }}
              >
                Descargar PDF
              </button>
            </div>
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
