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

  const [filtroGenero, setFiltroGenero] = useState("");
  const [filtroEdad, setFiltroEdad] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.log("Guardando carrito en localStorage:", carrito);
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);


  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 9;
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const indiceFin = indiceInicio + productosPorPagina;
  const productosPaginados = productos.slice(indiceInicio, indiceFin);

  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    console.log("Carrito guardado en localStorage:", carritoGuardado);
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);


  const cargarCatalogo = async () => {
    const data = await obtenerCatalogo(filtroGenero, filtroEdad);
    setProductos(data);
    const initialCantidades = {};
    data.forEach((p) => {
      initialCantidades[p.id_producto] = 1;
    });
    setCantidades(initialCantidades);
    setPaginaActual(1); // Reiniciar a página 1 al aplicar filtros
  };

  useEffect(() => {
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
    if (!producto || isNaN(producto.precio) || producto.precio <= 0 || cantidad <= 0) return;

    const maxCantidad = 10;
    const existingProductIndex = carrito.findIndex(
      (item) => item.producto.id_producto === producto.id_producto
    );

    if (existingProductIndex > -1) {
      const nuevoCarrito = [...carrito];
      const productoExistente = nuevoCarrito[existingProductIndex];
      const cantidadTotal = productoExistente.cantidad + cantidad;

      if (cantidadTotal <= maxCantidad) {
        nuevoCarrito[existingProductIndex] = {
          ...productoExistente,
          cantidad: cantidadTotal,
        };
        setCarrito(nuevoCarrito);
      } else {
        alert(`No puedes agregar más de ${maxCantidad} unidades de este producto.`);
      }
    } else {
      if (cantidad <= maxCantidad) {
        setCarrito([...carrito, { producto, cantidad }]);
      } else {
        alert(`No puedes agregar más de ${maxCantidad} unidades de este producto.`);
      }
    }
  };

  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  };

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

  return (
    <div className="catalogo-background">
      <div className="mt-3 flex-fill">
        <div className="my-5 position-relative">

          {/* Filtros */}
          <div className="filtros-container mb-4 text-center">
            <label className="me-2"></label>
            <select
              value={filtroGenero}
              onChange={(e) => setFiltroGenero(e.target.value)}
              className="me-4"
            >
              <option value="">Todos</option>
              <option value="Hombre">Masculino</option>
              <option value="Mujer">Femenino</option>
            </select>

            <label className="me-2"></label>
            <select
              value={filtroEdad}
              onChange={(e) => setFiltroEdad(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="Niños">Niños</option>
              <option value="Adolescentes">Adolescentes</option>
              <option value="Adultos">Adultos</option>
            </select>

            <button className="ms-4 btn btn-primary" onClick={cargarCatalogo}>
              Aplicar filtros
            </button>
          </div>

          {/* Carrito */}
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

          <br /><br /><br />

          {/* Productos */}
          <div className="row justify-content-center" id="catalogo">
            {productosPaginados.map((producto) => (
              <div
                className="producto col-md-3 m-4 text-center"
                key={producto.id_producto}
              >
                <img
                  src={`http://localhost:3001/cata/ID_Producto=${producto.id_producto}.jpeg`}
                  onError={(e) => (e.target.src = "/Images/logo-kym.png")}
                  alt={producto.producto}
                  className="img-fluid"
                />
                <h2>{producto.producto}</h2>
                <p>S/. {parseFloat(producto.precio).toFixed(2)}</p>

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
                    onWheel={(e) => e.target.blur()}
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
              <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
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
                  className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => cambiarPagina(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
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
