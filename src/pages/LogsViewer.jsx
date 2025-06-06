import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/styleLogs.css";
import { Table, Form, Row, Col } from "react-bootstrap";

const LogsViewer = () => {
  const [tabla, setTabla] = useState("");
  const [tipo, setTipo] = useState("");
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [filtroRegistro, setFiltroRegistro] = useState("");

  const tablasDisponibles = [
    "categoria_log",
    "cliente_log",
    "contrato_log",
    "producto_log",
    "stock_log",
    "stock_detalle_log",
    "usuario_log",
    "ventas_log",
    "ventas_detalle_log",
    "comprasusuario_log",
  ];

  const nombreTablas = {
    categoria_log: "CATEGORIA",
    cliente_log: "CLIENTE",
    contrato_log: "CONTRATO",
    producto_log: "PRODUCTO",
    stock_log: "STOCK",
    stock_detalle_log: "STOCK DETALLE",
    usuario_log: "USUARIO",
    ventas_log: "VENTAS",
    ventas_detalle_log: "VENTAS DETALLE",
    comprasusuario_log: "COMPRAS USUARIO",
  };

  useEffect(() => {
    if (tabla) {
      fetchLogs();
    } else {
      setLogs([]);
    }
  }, [tabla, tipo]);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const tipoMap = {
        INSERT: "I",
        UPDATE: "U",
        DELETE: "D",
      };
      const response = await axios.get("http://localhost:3001/api/v1/logs", {
        headers: { Authorization: `Bearer ${token}` },
        params: { tabla, tipo: tipo ? tipoMap[tipo] : undefined },
      });
      setLogs(response.data);
      setError("");
    } catch (err) {
      setError("Error al obtener los logs.");
      console.error(err);
    }
  };

  // Filtrar logs en frontend según filtroRegistro en el campo Registro
  const logsFiltrados = logs.filter((log) => {
    if (!filtroRegistro) return true; // si no hay filtro, mostrar todo
    return log.Registro?.toString().includes(filtroRegistro);
  });

  return (
    <div className="container-logs">
      <h2 className="admin-title">VISOR DE LOGS</h2>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Tabla:</Form.Label>
            <Form.Select
              value={tabla}
              onChange={(e) => setTabla(e.target.value)}
            >
              <option value="" disabled hidden>
                Escoja Cual Log
              </option>
              {tablasDisponibles.map((t) => (
                <option key={t} value={t}>
                  {nombreTablas[t] || t.toUpperCase()}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Tipo de operación:</Form.Label>
            <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="" >TODOS LOS REGISTROS</option>
              <option value="INSERT">NUEVOS REGISTROS</option>
              <option value="UPDATE">REGISTROS ACTUALIZADOS</option>
              <option value="DELETE">REGISTROS ELIMINADOS</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group>
            <Form.Label>Filtrar por Registro:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese ID de Registro"
              value={filtroRegistro}
              onChange={(e) => setFiltroRegistro(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

      {error && <p className="error text-danger">{error}</p>}

      <div className="table-responsive">
        <Table striped bordered hover size="sm" className="text-center">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Tabla</th>
              <th>Registro</th>
              <th>Campo</th>
              <th>Antes</th>
              <th>Después</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {logsFiltrados.map((log) => (
              <tr key={log.Id_log}>
                <td>{log.Id_log}</td>
                <td>
                  {{
                    I: "INSERT",
                    U: "UPDATE",
                    D: "DELETE",
                  }[log.Tipo] || log.Tipo}
                </td>
                <td>{log.Tabla}</td>
                <td>{log.Registro}</td>
                <td>{log.Campo}</td>
                <td>{log.ValorAntes}</td>
                <td>{log.ValorDespues}</td>
                <td>{log.Fecha}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default LogsViewer;
