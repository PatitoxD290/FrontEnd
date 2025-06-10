  import React, { useState, useContext, useEffect } from "react";
  import { useNavigate, useLocation } from "react-router-dom";
  import { AuthContext } from "../context/AuthContext";
  import "../css/styleLogin.css";
  import {
    agregarUsuario,
    loginUsuario,
    enviarCodigoSeguridad,
    verificarCodigoSeguridad,
  } from "../services/usuarioService";
  import { jwtDecode } from "jwt-decode";



  const LoginRegister = () => {
    const { setUser } = useContext(AuthContext); // Contexto de usuario
    const navigate = useNavigate();
    const location = useLocation();

    const [showPassword, setShowPassword] = useState(false);
    // Estados del componente
    const [isLoginActive, setIsLoginActive] = useState(true); // Controla si estamos en login o registro
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false); // Controla la verificación del código
    const [user, setUserRegister] = useState(""); // Nombre de usuario
    const [email, setEmail] = useState(""); // Correo
    const [password, setPassword] = useState(""); // Contraseña
    const [verificationCode, setVerificationCode] = useState(""); // Código de verificación
    const [message, setMessage] = useState({ text: "", type: "" }); // Mensajes de éxito/error
    const [isCodeValid, setIsCodeValid] = useState(false); // Estado que controla si el código es válido

    // Detectar si estamos en el registro
    useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      const registerParam = searchParams.get("register");
      if (registerParam === "true") {
        setIsLoginActive(false);
      }
    }, [location.search]);

    // Cambiar entre login y registro
    const toggleForm = () => {
      setIsLoginActive(!isLoginActive);
      setMessage({ text: "", type: "" });
      setIsVerifyingEmail(false); // Reseteamos la verificación de correo
      setIsCodeValid(false); // Reseteamos la validación del código
    };

    const validarEmail = (email) => {
      // Expresión regular simple para validar email
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validarPassword = (password) => {
      // Mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un símbolo
      return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,])[A-Za-z\d!@#$%^&*.,]{8,}$/.test(password);
    };

    // Función para manejar el registro de un nuevo usuario
    const handleRegister = async (e) => {
      e.preventDefault();

      if (!validarEmail(email)) {
        setMessage({ text: "Por favor ingresa un correo válido", type: "error" });
        return;
      }

      if (!validarPassword(password)) {
        setMessage({
          text: "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo especial.",
          type: "error",
        });
        return;
      }


      // Si aún no hemos verificado el código, no permitimos el registro
      if (!isCodeValid) {
        setMessage({
          text: "Por favor verifica el código antes de continuar",
          type: "error",
        });
        return;
      }

      try {
        const newUser = { user, email, password };
        const res = await agregarUsuario(newUser); // Llamamos al servicio de registro

        // Aquí no guardamos el token porque el backend no lo devuelve
        setMessage({
          text: "¡Registro exitoso! Ahora puedes iniciar sesión.",
          type: "success",
        });

        // Cambiar a la vista de login para que el usuario pueda iniciar sesión
        setIsLoginActive(true);
      } catch (err) {
        setMessage({
          text: err.message || "Error en el registro",
          type: "error",
        });
      }
    };

    // Función para manejar el login de un usuario
    const handleLogin = async (e) => {
      e.preventDefault();

      if (!validarEmail(email)) {
        setMessage({ text: "Por favor ingresa un correo válido", type: "error" });
        return;
      }

      if (password.length < 8) {
        setMessage({
          text: "La contraseña debe tener mínimo 8 caracteres",
          type: "error",
        });
        return;
      }
      try {
        const res = await loginUsuario(email, password);
        if (res && res.token) {
          const token = res.token;
          localStorage.setItem("token", token);
          const decoded = jwtDecode(token);
          setUser(decoded);
          setMessage({ text: "¡Bienvenido!", type: "success" });

          setTimeout(() => navigate("/"), 1000);
        } else {
          setMessage({ text: "Credenciales incorrectas", type: "error" });
        }
      } catch (err) {
        setMessage({ text: "Credenciales incorrectas", type: "error" });
      }
    };

    // Enviar código de verificación al correo
    const handleEnviarCodigo = async (e) => {
      e.preventDefault();
      try {
        const res = await enviarCodigoSeguridad(email); // Llamamos al servicio para enviar el código
        setMessage({
          text: res.message || "Código enviado con éxito",
          type: "success",
        });
        setIsVerifyingEmail(true); // Activamos la verificación del código
      } catch (err) {
        setMessage({
          text: err.message || "Error al enviar el código",
          type: "error",
        });
      }
    };

    // Verificar el código de seguridad enviado al correo
    const handleVerificarCodigo = async (e) => {
      e.preventDefault();
      if (isNaN(verificationCode) || verificationCode <= 0) {
        setMessage({
          text: "El código debe ser un número válido",
          type: "error",
        });
        return;
      }

      try {
        const res = await verificarCodigoSeguridad(verificationCode); // Verificamos el código
        setMessage({
          text: res.message || "Código verificado con éxito",
          type: "success",
        });
        setIsCodeValid(true); // El código es válido, habilitamos el botón de registro
      } catch (err) {
        setMessage({ text: err.message || "Código inválido", type: "error" });
        setIsCodeValid(false); // El código es inválido, no habilitamos el botón
      }
    };

    return (
  <div className="body-login">
    <div className={`container-form ${isLoginActive ? "login" : "register"}`}>
      <div className="information">
        <div className="info-childs">
          <h2>
            {isLoginActive
              ? "¿No tienes una cuenta?"
              : "¿Ya tienes una cuenta?"}
          </h2>
          <input
            type="button"
            value={isLoginActive ? "Registrarse" : "Iniciar Sesión"}
            onClick={toggleForm}
          />
        </div>
      </div>

      <div className="form-information">
        <div className="form-information-childs">
          <h2>{isLoginActive ? "Iniciar Sesión" : "Crear una Cuenta"}</h2>
          {message.text && (
            <div
              className={`alert ${message.type === "error" ? "alert-danger" : "alert-success"}`}
              role="alert"
            >
              {message.text}
            </div>
          )}

          <form
            className="form"
            onSubmit={isLoginActive ? handleLogin : handleRegister}
          >
            {/* Registro */}
            {!isLoginActive && (
              <>
                <label>
                  <input
                    type="text"
                    placeholder="Usuario"
                    value={user}
                    onChange={(e) => setUserRegister(e.target.value)}
                    required
                  />
                </label>

                <label className="password-label">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-register"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </label>

                {!validarPassword(password) && password.length > 0 && (
                  <div className="password-requirements">
                    <small className="text-danger">
                      La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo especial.
                    </small>
                  </div>
                )}

                <label>
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>

                {!isVerifyingEmail && (
                  <div className="btn-enviar-code">
                    <button onClick={handleEnviarCodigo}>
                      Enviar código de verificación
                    </button>
                  </div>
                )}

                {isVerifyingEmail && (
                  <>
                    <label>
                      <input
                        className="input-verify-code"
                        type="number"
                        placeholder="Código de verificación"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        min="1"
                        required
                      />
                    </label>

                    <div className="btn-verify-code">
                      <button onClick={handleVerificarCodigo}>
                        Verificar código
                      </button>
                    </div>
                  </>
                )}

                <button className="btn-login" disabled={!isCodeValid}>
                  Registrarse
                </button>
              </>
            )}

            {/* Login */}
            {isLoginActive && (
              <>
                <label>
                  <input
                    className="input-email"
                    type="email"
                    placeholder="Correo Electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label> <br />

                <label className="password-label">
                  <input
                    className="input-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password-login"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </label> <br />

                <button className="btn-login">Iniciar Sesión</button>
              </>
            )}

            {isLoginActive && (
              <div className="text-center">
                <a className="small" href="/recuperar-contraseña">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  </div>
    );
  };

  export default LoginRegister;
