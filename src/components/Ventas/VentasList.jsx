// components/Ventas/VentasList.jsx
import React, { useState } from "react";
import { Table, Button, Pagination } from "react-bootstrap";

const VentasList = ({ ventas, mostrarDetalles }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const totalPaginas = Math.ceil(ventas.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFinal = indiceInicio + elementosPorPagina;
  const ventasPaginadas = ventas.slice(indiceInicio, indiceFinal);

  const irPrimeraPagina = () => setPaginaActual(1);
  const irUltimaPagina = () => setPaginaActual(totalPaginas);
  const irAnterior = () => setPaginaActual(prev => Math.max(prev - 1, 1));
  const irSiguiente = () => setPaginaActual(prev => Math.min(prev + 1, totalPaginas));

  const obtenerItemsPaginacion = () => {
    const paginas = [];
    let inicio = Math.max(paginaActual - 2, 1);
    let fin = Math.min(paginaActual + 2, totalPaginas);

    if (paginaActual <= 2) fin = Math.min(5, totalPaginas);
    else if (paginaActual >= totalPaginas - 1) inicio = Math.max(totalPaginas - 4, 1);

    for (let i = inicio; i <= fin; i++) {
      paginas.push(
        <Pagination.Item
          key={i}
          active={i === paginaActual}
          onClick={() => setPaginaActual(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    return paginas;
  };

  return (
    <>
      <Table className="admin-table">
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Cliente</th>
            <th>Lugar Entrega</th>
            <th>Total</th>
            <th>Forma Pago</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventasPaginadas.map(venta => (
            <tr key={venta.id_ventas}>
              <td>{venta.id_ventas}</td>
              <td>{venta.id_cliente}</td>
              <td>{venta.lugar_entrega}</td>
              <td>{venta.total}</td>
              <td>{venta.forma_pago}</td>
              <td>{venta.fecha}</td>
              <td>{venta.hora}</td>
              <td>
                <Button
                  className="btn-details"
                  onClick={() => mostrarDetalles(venta)}
                >
                  Mostrar detalles
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="Pagination">
        <Pagination.First onClick={irPrimeraPagina} disabled={paginaActual === 1} />
        <Pagination.Prev onClick={irAnterior} disabled={paginaActual === 1} />
        {obtenerItemsPaginacion()}
        <Pagination.Next onClick={irSiguiente} disabled={paginaActual === totalPaginas} />
        <Pagination.Last onClick={irUltimaPagina} disabled={paginaActual === totalPaginas} />
      </Pagination>
    </>
  );
};

export default VentasList;
