import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { BsChatDots } from "react-icons/bs";
import { obtenerCatalogo } from "../services/catalogoService";
import "../css/styleHome.css";

const Inicio = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);

  const navigate = useNavigate();
  
  
    const handleClick = () => {
      navigate("/solicitar-contrato");
    };

  useEffect(() => {
    const idsDestacados = [2, 8]; // IDs específicos

    const cargarProductos = async () => {
      try {
        const todos = await obtenerCatalogo();
        const filtrados = todos.filter((p) =>
          idsDestacados.includes(p.id_producto)
        );
        setProductosDestacados(filtrados);
      } catch (error) {
        console.error("Error al cargar productos destacados:", error);
      }
    };

    cargarProductos();
  }, []);
  

  return (
    <div className="inicio">
      <section className="presentacion">
        <Container>
          <h1>Bienvenido a CONFECCIONES KYM</h1>
          <p>
            Comprometidos con la excelencia en diseño, calidad y personalización
            de uniformes para tu institución o empresa.
          </p>
        </Container>
      </section>

      <section className="destacados">
        <Container>
          <h2>Productos destacados</h2>
          <Row className="justify-content-center">
            {productosDestacados.map((producto) => (
              <Col md={4} key={producto.id_producto} className="mb-4">
                <Card className="producto-card text-center shadow-sm">
                  <Card.Img
                    variant="top"
                    src={`/Images/ID_Producto=${producto.id_producto}.jpeg`}
                    onError={(e) => (e.target.src = "/Images/default.jpeg")}
                    alt=""
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{producto.producto}</Card.Title>
                    <Card.Text>
                      {producto.descripcion || "Sin descripción disponible"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="ver-catalogo text-center mt-4">
            <Button as={Link} to="/catalogo">
              Ver catálogo completo
            </Button>
          </div>
        </Container>
      </section>

      <section className="solicitar-contrato">
        <Container>
          <h2>Solicita un contrato de confección</h2>
          <p>
            ¿Necesitas uniformes o prendas en grandes cantidades para tu
            institución o empresa? Solicita un contrato con nosotros y recibe
            atención personalizada, precios especiales y diseños a medida.
          </p>
          <div className="ver-catalogo text-center mt-3">
            <Button onClick={handleClick}>
              <BsChatDots className="me-2" />
              Solicitar contrato
            </Button>
          </div>
        </Container>
      </section>

      <section className="informacion">
        <Container>
          <h2>Contáctanos</h2>
          <p>
            Visítanos, escríbenos o llámanos para recibir atención
            personalizada.
          </p>
          <div className="contacto-grid">
            <div>
              <h5>Ubicación</h5>
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3946.9799772197557!2d-74.55365022498837!3d-8.403626691634855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zOMKwMjQnMTMuMSJTIDc0wrAzMycwMy45Ilc!5e0!3m2!1ses-419!2spe!4v1748814426959!5m2!1ses-419!2spe"
                width="100%"
                height="200"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
            <div>
              <h5>WhatsApp</h5>
              <p>
                <a
                  href="https://wa.me/51912345678"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +51 990 834 472
                </a>
              </p>

              <h5>Correo</h5>
              <p>
                <a href="mailto:contacto@kymuniformes.com">
                  confeccioneskym@gmail.com
                </a>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Inicio;
