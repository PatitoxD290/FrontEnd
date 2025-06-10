import React, { useState } from "react";
import { Table, Pagination } from "react-bootstrap";

const ComprasUsuarioList = ({ compras }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const totalPaginas = Math.ceil(compras.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFinal = indiceInicio + elementosPorPagina;
  const comprasPaginadas = compras.slice(indiceInicio, indiceFinal);

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
      <Table className="table-gestion">
        <thead>
          <tr>
            <th>ID Compra</th>
            <th>Usuario</th>
            <th>Productos</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {comprasPaginadas.map((compra, index) => (
            <tr key={index}>
              <td>{compra.id_ventas}</td>
              <td>{compra.user}</td>
              <td>{compra.Productos}</td>
              <td>PEN {parseFloat(compra.total).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {totalPaginas > 1 && (
        <Pagination className="Pagination">
          <Pagination.First onClick={irPrimeraPagina} disabled={paginaActual === 1} />
          <Pagination.Prev onClick={irAnterior} disabled={paginaActual === 1} />
          {obtenerItemsPaginacion()}
          <Pagination.Next onClick={irSiguiente} disabled={paginaActual === totalPaginas} />
          <Pagination.Last onClick={irUltimaPagina} disabled={paginaActual === totalPaginas} />
        </Pagination>
      )}
    </>
  );
};

export default ComprasUsuarioList;
