import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { obtenerCatalogo } from '../services/catalogoService';
import '../css/styleHome.css';

const Inicio = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);

  useEffect(() => {
    const idsDestacados = [2, 8]; // IDs específicos

    const cargarProductos = async () => {
      try {
        const todos = await obtenerCatalogo();
        const filtrados = todos.filter(p =>
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
          <p>Comprometidos con la excelencia en diseño, calidad y personalización de uniformes para tu institución o empresa.</p>
        </Container>
      </section>

      <section className="destacados">
        <Container>
          <h2>Productos destacados</h2>
          <Row className="justify-content-center">
            {productosDestacados.map(producto => (
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
                    <Card.Text>{producto.descripcion || "Sin descripción disponible"}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="ver-catalogo text-center mt-4">
            <Button as={Link} to="/catalogo">Ver catálogo completo</Button>
          </div>
        </Container>
      </section>

      <section className="informacion">
        <Container>
          <h2>Contáctanos</h2>
          <p>Visítanos, escríbenos o llámanos para recibir atención personalizada.</p>
          <div className="contacto-grid">
            <div>
              <h5>Ubicación</h5>
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.000000000000!2d-77.000000000000!3d-12.000000000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0000000000000000!2sTu+Empresa!5e0!3m2!1ses!2spe!4v123456789"
                width="100%"
                height="200"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
            <div>
              <h5>WhatsApp</h5>
              <p><a href="https://wa.me/51912345678" target="_blank" rel="noopener noreferrer">+51 912 345 678</a></p>

              <h5>Correo</h5>
              <p><a href="mailto:contacto@kymuniformes.com">contacto@kymuniformes.com</a></p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Inicio;
