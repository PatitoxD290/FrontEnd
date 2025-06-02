import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/styleRecuperarContra.css"; // Estilos de tu formulario
import { enviarCodigoSeguridad, recuperarContraseña, verificarCodigoSeguridad } from "../services/usuarioService"; // Asegúrate de que el service esté bien configurado

const RecuperarContraseña = () => {
  const navigate = useNavigate();

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationCode, setValidationCode] = useState(""); // Código de validación
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isCodeVerified, setIsCodeVerified] = useState(false); // Verificación del código
  const [isVerificationEnabled, setIsVerificationEnabled] = useState(false); // Habilitar "Verificar" solo si hay correo

  // Manejar cambio de correo electrónico
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsVerificationEnabled(e.target.value.trim() !== ""); // Habilita botón si hay texto
  };

  // Manejar cambio del código de validación
  const handleValidationCodeChange = (e) => {
    setValidationCode(e.target.value);
  };

  // Enviar código de seguridad al correo
  const handleSendVerificationCode = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage({ text: "Por favor ingresa tu correo electrónico", type: "error" });
      return;
    }

    try {
      const res = await enviarCodigoSeguridad(email);
      setMessage({ text: res.message || "Código enviado correctamente", type: "success" });
      setIsCodeVerified(false); // Resetear verificación
    } catch (err) {
      setMessage({ text: err.message || "Hubo un error al enviar el código", type: "error" });
    }
  };

  // Verificar código de seguridad
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!validationCode) {
      setMessage({ text: "Por favor ingresa el código de validación", type: "error" });
      return;
    }

    try {
      const res = await verificarCodigoSeguridad(validationCode);
      setMessage({ text: res.message || "Código verificado correctamente", type: "success" });
      setIsCodeVerified(true);
    } catch (err) {
      setMessage({ text: err.message || "Código de validación incorrecto", type: "error" });
      setIsCodeVerified(false);
    }
  };

  // Cambiar contraseña (solo si código verificado)
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage({ text: "Por favor llena todos los campos", type: "error" });
      return;
    }

    if (!isCodeVerified) {
      setMessage({ text: "Por favor verifica el código antes de continuar", type: "error" });
      return;
    }

    try {
      const res = await recuperarContraseña(email, password);
      setMessage({ text: res.message || "¡Contraseña cambiada exitosamente!", type: "success" });

      // Redirigir al login después de 2 segundos
      setTimeout(() => navigate("/acceder"), 2000);
    } catch (err) {
      setMessage({ text: err.message || "Error al cambiar la contraseña", type: "error" });
    }
  };

  return (
  <div className="recuperar-body">
    <div className="recuperar-container-form">
      <div className="recuperar-form-information">
        <div className="recuperar-form-content">
          <h2 className="recuperar-title">Cambiar Contraseña</h2>

          {/* Mensaje de éxito o error */}
          {message.text && (
            <div
              className={`recuperar-alert ${
                message.type === "error" ? "recuperar-alert-danger" : "recuperar-alert-success"
              }`}
            >
              {message.text}
            </div>
          )}

          <form className="recuperar-form">
            <label className="recuperar-label">
              <i className="bx bx-envelope"></i>
              <input
                type="email"
                placeholder="Correo Electrónico"
                value={email}
                onChange={handleEmailChange}
                required
                className="recuperar-input"
              />
            </label>

            <label className="recuperar-label">
              <i className="bx bx-lock-alt"></i>
              <input
                type="password"
                placeholder="Nueva Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="recuperar-input"
              />
            </label>

            <div className="recuperar-btn-container">
              <input
                type="button"
                value="Verificar Correo"
                onClick={handleSendVerificationCode}
                disabled={!isVerificationEnabled}
                className="recuperar-btn"
              />
            </div>
          </form>

          {isCodeVerified === false && (
            <div className="recuperar-validation">
              <label className="recuperar-label">
                <input
                  type="number"
                  placeholder="Código de Validación"
                  value={validationCode}
                  onChange={handleValidationCodeChange}
                  required
                  className="recuperar-input"
                />
              </label>

              <input
                type="button"
                value="Verificar Código"
                onClick={handleVerifyCode}
                className="recuperar-btn"
              />
            </div>
          )}

          {isCodeVerified && (
            <div className="recuperar-confirmar">
              <input
                type="button"
                value="Cambiar Contraseña"
                onClick={handleChangePassword}
                disabled={!isCodeVerified}
                className="recuperar-btn"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

};

export default RecuperarContraseña;
