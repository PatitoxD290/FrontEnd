import React, { useState } from "react";
import { Table, Button, Pagination } from "react-bootstrap";

const ProductoList = ({ productos, seleccionar }) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  const totalPaginas = Math.ceil(productos.length / elementosPorPagina);
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const indiceFinal = indiceInicio + elementosPorPagina;
  const productosPaginados = productos.slice(indiceInicio, indiceFinal);

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
            <th>ID</th>
            <th>Producto</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Costo</th>
            <th>ID Categoría</th>
            <th>Material</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosPaginados.map(p => (
            <tr key={p.id_producto}>
              <td>{p.id_producto}</td>
              <td>{p.producto}</td>
              <td>{p.descripcion}</td>
              <td>{p.precio}</td>
              <td>{p.costo}</td>
              <td>{p.id_categoria}</td>
              <td>{p.material}</td>
              <td>{p.estado}</td>
              <td>
                <Button className="btn-edit" onClick={() => seleccionar(p)}>Editar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="Pagination">
        <Pagination.First onClick={() => setPaginaActual(1)} disabled={paginaActual === 1} />
        <Pagination.Prev onClick={() => setPaginaActual(p => Math.max(p - 1, 1))} disabled={paginaActual === 1} />
        {obtenerItemsPaginacion()}
        <Pagination.Next onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))} disabled={paginaActual === totalPaginas} />
        <Pagination.Last onClick={() => setPaginaActual(totalPaginas)} disabled={paginaActual === totalPaginas} />
      </Pagination>
    </>
  );
};

export default ProductoList;
