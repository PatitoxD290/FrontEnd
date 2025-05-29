import { Link } from 'react-router-dom';
import '../css/Global.css'; // Asegúrate de que los estilos se hereden

export default function AuthRequired() {
  return (
    <div className="auth-required-page">
      <h2>¡Regístrate o Inicia Sesión para Continuar!</h2>
      <p>Necesitas una cuenta para realizar compras.</p>
      <div className="auth-required-buttons">
        <Link to="/acceder" className="btn-login">Iniciar Sesión</Link>
        <Link to="/acceder?register=true" className="btn-register">Registrarse</Link>
      </div>
    </div>
  );
}