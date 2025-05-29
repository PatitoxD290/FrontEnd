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

import "../css/Dashboard.css"; // Importa el CSS aquí

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = "http://localhost:3001/api/v1";

const obtenerToken = () => localStorage.getItem("token");

const hacerPeticion = async (url, metodo = "GET", datos = null) => {
  const token = obtenerToken();
  const config = {
    method: metodo,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  if (datos) config.body = JSON.stringify(datos);

  const res = await fetch(url, config);
  if (!res.ok) throw new Error("Error en la petición");
  return res.json();
};

const Dashboard = () => {
  const [ventasPorMes, setVentasPorMes] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    hacerPeticion(`${API_URL}/ventas-mes`)
      .then(setVentasPorMes)
      .catch((e) => setError(e.message));

    hacerPeticion(`${API_URL}/ventas-productos-mas-vendidos`)
      .then(setProductosMasVendidos)
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

  return (
    <div className="body">
      <h2>Dashboard de Ventas</h2>

      {error && <p>Error cargando datos: {error}</p>}

      <section>
        <h3>Ventas por mes</h3>
        <Bar data={dataVentasMes} options={opcionesVentasMes} />
      </section>

      <section>
        <h3>Productos más vendidos</h3>
        <Pie data={dataProductos} />
      </section>
    </div>
  );
};

export default Dashboard;
