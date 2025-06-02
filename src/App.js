// App.js
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import Home from "./pages/Home";
import Usuarios from "./pages/Usuarios";
import Clientes from "./pages/Clientes";
import Catalogo from "./pages/Catalogo";
import Pago from "./pages/Pago";
import Navbar from "./components/shared/Navbar";
import LogsViewer from "./pages/LogsViewer";
import Footer from "./components/shared/Footer";
import LoginRegister from "./pages/LoginRegister";
import AuthRequired from './pages/AuthRequired';
import DetallesCompra from './pages/DetallesCompra';
import DatosCliente from './pages/DatosCliente';
import RecuperarContraseña from './pages/RecupererContraseña'; 
import Dashboard from "./pages/Dashboard";
import CompraUsuario from "./pages/CompraUsuario";
import SolicitarContrato from "./pages/Contrato"

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

// Filtrar advertencias de "future flags" de React Router
if (process.env.NODE_ENV === 'development') {
  const originalConsoleWarn = console.warn;
  console.warn = (message) => {
    if (!message.includes('React Router Future Flag Warning')) {
      originalConsoleWarn(message);
    }
  };
}

const AppContent = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="mt-3 flex-fill">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/usuarios" element={user ? <Usuarios /> : <Navigate to="/acceder" />} />
          <Route path="/clientes" element={user ? <Clientes /> : <Navigate to="/acceder" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/acceder" />} />
          <Route path="/acceder" element={!user ? <LoginRegister /> : <Navigate to="/" />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/pago" element={user ? <Pago /> : <Navigate to="/auth-required" />} />
          <Route path="/auth-required" element={<AuthRequired />} />
          <Route path="/detalles-compra" element={<DetallesCompra />} />
          <Route path="/datos-cliente" element={<DatosCliente />} />
          <Route path="/logs" element={user ? <LogsViewer /> : <Navigate to="/acceder" />} />
          <Route path="/compra-usuario" element={user ? <CompraUsuario /> : <Navigate to="/acceder" />} />
           <Route path="/solicitar-contrato" element={user ? <SolicitarContrato /> : <Navigate to="/acceder" />} />
          <Route path="/recuperar-contraseña" element={user ? <Navigate to="/" /> : <RecuperarContraseña />}
          />
          
        </Routes>
      </div>
      <Footer />
    </>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
