import React from "react";
import { Container } from "react-bootstrap";
import "../../css/NavarAndFooter.css";
const Footer = () => {
  return (

<footer className="bg-light text-dark py-3 mt-auto">
      <Container className="text-center">
        <small>
          <p>BrayanPato, DENNI, RODRI, MAYCOL &copy; {new Date().getFullYear()}</p>
        </small>
      </Container>
    </footer>
  );
};

export default Footer;
