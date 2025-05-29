import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/styleLogin.css"; // Estilos de tu formulario
import { agregarUsuario, enviarCodigoSeguridad, verificarCodigoSeguridad } from "../services/usuarioService"; // Asegúrate de que el service esté bien configurado

const Register = () => {
  const navigate = useNavigate();

  // Estados del formulario
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationCode, setValidationCode] = useState(""); // Código de validación
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isCodeVerified, setIsCodeVerified] = useState(false); // Verificación del código
  const [isVerificationEnabled, setIsVerificationEnabled] = useState(false); // Habilitar "Verificar" solo si hay correo

  // Función para manejar el cambio del correo electrónico
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setIsVerificationEnabled(e.target.value.trim() !== ""); // Habilita el botón si hay texto en el correo
  };

  // Función para manejar el código de validación
  const handleValidationCodeChange = (e) => {
    setValidationCode(e.target.value);
  };

  // Función para manejar el envío del código de verificación
  const handleSendVerificationCode = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage({ text: "Por favor ingresa tu correo electrónico", type: "error" });
      return;
    }

    try {
      const res = await enviarCodigoSeguridad(email);
      setMessage({ text: res.message || "Código enviado correctamente", type: "success" });
      setIsCodeVerified(false); // Asegurándonos de que el código no esté verificado inicialmente
    } catch (err) {
      setMessage({ text: err.message || "Hubo un error al enviar el código", type: "error" });
    }
  };

  // Función para manejar la verificación del código
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!validationCode) {
      setMessage({ text: "Por favor ingresa el código de validación", type: "error" });
      return;
    }

    try {
      const res = await verificarCodigoSeguridad(validationCode); // Verificamos el código ingresado
      setMessage({ text: res.message || "Código verificado correctamente", type: "success" });
      setIsCodeVerified(true); // Habilitamos la opción para continuar con el registro
    } catch (err) {
      setMessage({ text: err.message || "Código de validación incorrecto", type: "error" });
      setIsCodeVerified(false); // Mantener la verificación en falso si el código es incorrecto
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!user || !email || !password) {
      setMessage({ text: "Por favor llena todos los campos", type: "error" });
      return;
    }

    if (!isCodeVerified) {
      setMessage({ text: "Por favor verifica el código antes de continuar", type: "error" });
      return;
    }

    try {
      const newUser = { user, email, password };
      const res = await agregarUsuario(newUser); // Llamamos al servicio de registro

      setMessage({ text: "¡Registro exitoso!", type: "success" });

      // Redirigir al login después de 2 segundos
      setTimeout(() => navigate("/acceder"), 2000);
    } catch (err) {
      setMessage({ text: err.message || "Error en el registro", type: "error" });
    }
  };

  return (
    <div className="body">
      <div className="container-form">
        <div className="form-information">
          <div className="form-information-childs">
            <h2>Crear una Cuenta</h2>

            {/* Mensaje de éxito o error */}
            {message.text && (
              <div className={`alert ${message.type === "error" ? "alert-danger" : "alert-success"}`}>
                {message.text}
              </div>
            )}

            {/* Formulario para ingresar el correo */}
            <form className="form">
              <label>
                <i className="bx bx-user"></i>
                <input
                  type="text"
                  placeholder="Usuario"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  required
                />
              </label>

              <label>
                <i className="bx bx-envelope"></i>
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </label>

              <label>
                <i className="bx bx-lock-alt"></i>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              {/* Botón de "Verificar", habilitado solo si hay correo ingresado */}
              <div className="text-center">
                <input
                  type="button"
                  value="Verificar Correo"
                  onClick={handleSendVerificationCode}
                  disabled={!isVerificationEnabled} // Solo habilitado si el correo está presente
                />
              </div>
            </form>

            {/* Código de validación */}
            {isCodeVerified === false && (
              <div className="validation-container">
                <label>
                  <input
                    type="number" // Usamos 'number' para que sea más adecuado al código
                    placeholder="Código de Validación"
                    value={validationCode}
                    onChange={handleValidationCodeChange}
                    required
                  />
                </label>

                <input
                  type="submit"
                  value="Verificar Código"
                  onClick={handleVerifyCode} // Verifica el código ingresado
                />
              </div>
            )}

            {/* Solo habilitar el formulario de registro si el código es correcto */}
            {isCodeVerified && (
              <div className="register-container">
                <input
                  type="submit"
                  value="Registrar"
                  onClick={handleRegister} // Llama a la función para registrar al usuario
                  disabled={!isCodeVerified} // Deshabilitar el botón hasta que el código esté verificado
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
