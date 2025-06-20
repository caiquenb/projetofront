import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Formulario from "./pages/Formulario";
import ConsultaProdutos from "./pages/Consulta"; // ✅ importa aqui
import Sidebar from "./components/Sidebar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ListaProdutos from "./pages/ListaProdutos";
// Rota protegida com layout
function PrivateRoute({ children }) {
  const { usuario } = useAuth();
  return usuario ? (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full">{children}</main>
    </div>
  ) : (
    <Navigate to="/login" />
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* ✅ FORMULÁRIO */}
          <Route
            path="/formulario"
            element={
              <PrivateRoute>
                <Formulario />
              </PrivateRoute>
            }
          />

          {/* ✅ CONSULTA */}
          <Route
            path="/consulta"
            element={
              <PrivateRoute>
                <ConsultaProdutos />
              </PrivateRoute>
            }
          />
          <Route
           path="/ListaProdutos"
            element={
            <PrivateRoute>
      <ListaProdutos />
    </PrivateRoute>
  }
/>


          {/* Redirecionamento padrão */}
          <Route path="*" element={<Navigate to="/formulario" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}



// dentro do seu componente principal
<ListaProdutos onEditar={(produto) => setFormData(produto)} />



export default App;
