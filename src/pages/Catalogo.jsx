import React, { useEffect, useState, useRef } from "react";
import { obtenerCatalogo } from "../services/catalogoService.js";
import "../css/styleCatalogo.css";
import { BsCart4 } from "react-icons/bs";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const carritoRef = useRef(null);
  const [cantidades, setCantidades] = useState({});

  const navigate = useNavigate();
  const { user } = useAuth();

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 9;
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const indiceFin = indiceInicio + productosPorPagina;
  const productosPaginados = productos.slice(indiceInicio, indiceFin);

  useEffect(() => {
    const cargarCatalogo = async () => {
      const data = await obtenerCatalogo();
      setProductos(data);
      const initialCantidades = {};
      data.forEach((p) => {
        initialCantidades[p.id_producto] = 1; // Inicializar cantidad como 1
      });
      setCantidades(initialCantidades);
    };
    cargarCatalogo();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (carritoRef.current && !carritoRef.current.contains(event.target)) {
        setMostrarCarrito(false);
      }
    };

    if (mostrarCarrito) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mostrarCarrito]);

  const agregarACarrito = (producto, cantidad) => {
    console.log("Producto recibido:", producto);
    if (
      !producto ||
      isNaN(producto.precio) ||
      producto.precio <= 0 ||
      cantidad <= 0
    )
      return;

    // Verificar si ya existe el producto en el carrito
    const existingProductIndex = carrito.findIndex(
      (item) => item.producto.id_producto === producto.id_producto
    );

    // Verificar si la cantidad total no excede el límite de 10 unidades por producto
    if (existingProductIndex > -1) {
      const nuevoCarrito = [...carrito];
      const cantidadTotal =
        nuevoCarrito[existingProductIndex].cantidad + cantidad;

      // Limitar cantidad en carrito a 10 unidades como máximo
      const maxCantidad = 10;
      if (cantidadTotal <= maxCantidad) {
        nuevoCarrito[existingProductIndex].cantidad = cantidadTotal;
        setCarrito(nuevoCarrito);
      } else {
        alert(
          `No puedes agregar más de ${maxCantidad} unidades de este producto.`
        );
      }
    } else {
      const maxCantidad = 10;
      if (cantidad <= maxCantidad) {
        setCarrito([...carrito, { producto, cantidad }]);
      } else {
        alert(
          `No puedes agregar más de ${maxCantidad} unidades de este producto.`
        );
      }
    }
  };

  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  };

  // Función de pago actualizada
  const pagar = () => {
    if (!user) {
      navigate("/auth-required");
      return;
    }

    if (carrito.length === 0) {
      alert("Tu carrito está vacío. No puedes proceder con el pago.");
      return;
    }

    navigate("/detalles-compra", {
      state: {
        productos: carrito.map((item) => ({
          id: item.producto.id_producto,
          nombre: item.producto.producto,
          precio: parseFloat(item.producto.precio),
          cantidad: item.cantidad,
          id_categoria: item.producto.id_categoria,
        })),
        total: carrito.reduce(
          (acc, item) => acc + parseFloat(item.producto.precio) * item.cantidad,
          0
        ),
      },
    });
  };

  // Cálculos
  const total = carrito.reduce(
    (acc, item) => acc + parseFloat(item.producto.precio) * item.cantidad,
    0
  );

  const cambiarPagina = (numeroPagina) => {
    if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
      setPaginaActual(numeroPagina);
    }
  };

  const manejarCambioCantidad = (id_producto, cantidad) => {
    setCantidades((prevCantidades) => ({
      ...prevCantidades,
      [id_producto]: cantidad,
    }));
  };

  // Renderizado
  return (
    <div className="catalogo-background">
      <div className=" mt-3 flex-fill">
        <div className=" my-5 position-relative">
          {/* Carrito flotante */}
          <div className="carrito-contenedor">
            <button
              className="btn-carrito"
              onClick={() => setMostrarCarrito(!mostrarCarrito)}
            >
              <BsCart4 size={15} className="me-2" />
              Carrito ({carrito.length})
            </button>

            {mostrarCarrito && (
              <div ref={carritoRef} className="carrito-ventana">
                {carrito.length === 0 ? (
                  <p>Tu carrito está vacío</p>
                ) : (
                  <>
                    {carrito.map((item, index) => (
                      <div key={index} className="producto-carrito">
                        <span>
                          <strong>
                            {item.producto?.producto || "Nombre no disponible"}:
                            S/. {parseFloat(item.producto.precio).toFixed(2)} (
                            {item.cantidad})
                          </strong>
                          <br />
                          <strong>
                            S/.{" "}
                            {(
                              item.cantidad * parseFloat(item.producto.precio)
                            ).toFixed(2)}
                          </strong>
                        </span>
                        <button
                          className="btn-delet"
                          onClick={() => eliminarDelCarrito(index)}
                        >
                          X
                        </button>
                      </div>
                    ))}
                    <div className="mt-3">
                      <strong>Total: S/. {total.toFixed(2)}</strong>
                    </div>
                    <button className="btn-pay mt-3" onClick={pagar}>
                      Pagar
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <br />
          <h1 className="titulo-catalogo text-center mb-4">CATÁLOGO</h1>

          {/* Productos paginados */}
          <div className="row justify-content-center" id="catalogo">
            {productosPaginados.map((producto) => (
              <div
                className="producto col-md-3 m-4 text-center"
                key={producto.id_producto}
              >
                <img
                  src={`/Images/ID_Producto=${producto.id_producto}.jpeg`}
                  onError={(e) => (e.target.src = "/Images/default.jpeg")}
                  alt={producto.producto}
                  className="img-fluid"
                />
                <h2>{producto.producto}</h2>
                <p>S/. {parseFloat(producto.precio).toFixed(2)}</p>

                {/* INPUT CANTIDAD */}
                <div className="cantidad-input-container">
                  <label
                    htmlFor={`cantidad-${producto.id_producto}`}
                    className="me-2 cantidad-label"
                  >
                    Cantidad:
                  </label>
                  <input
                    id={`cantidad-${producto.id_producto}`}
                    type="number"
                    min="1"
                    max={10}
                    value={cantidades[producto.id_producto] || 1}
                    onChange={(e) =>
                      manejarCambioCantidad(
                        producto.id_producto,
                        parseInt(e.target.value)
                      )
                    }
                    onWheel={(e) => e.target.blur()} // 👈 aquí evitamos el scroll accidental
                    className="cantidad-input"
                  />
                </div>

                <button
                  className="btn-add"
                  onClick={() =>
                    agregarACarrito(
                      producto,
                      cantidades[producto.id_producto] || 1
                    )
                  }
                >
                  Añadir al Carrito
                </button>
              </div>
            ))}
          </div>

          {/* Paginación */}
          <div className="CustomPagination">
            <ul className="pagination">
              <li
                className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                >
                  ←
                </button>
              </li>
              {[...Array(totalPaginas)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    paginaActual === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => cambiarPagina(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  paginaActual === totalPaginas ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                >
                  →
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalogo;
