import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// ...




function Sidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen bg-black text-white fixed flex flex-col justify-between">
      <div>
        <div className="p-6 text-xl font-bold border-b border-gray-700">
          Himaflex
        </div>
        <nav className="p-4">
          <p className="mb-2">Usuário: <strong>{usuario?.login || "—"}</strong></p>
          <p className="mb-4">Setor: {usuario?.setor} | Turno: {usuario?.turno}</p>
          <ul>
            <li className="mb-2">
              <Link to="/formulario" className="hover:underline">Formulário</Link>
            </li>
          </ul>
          <ul>
            <li className="mb-2">
             <Link to="/consulta" className="hover:underline">Produtos</Link>
            </li>
          </ul>
          <ul>
            <li className="mb-2">
             <Link to="/ListaProdutos" className="hover:underline">Lista</Link>
            </li>
          </ul>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white m-4 py-2 rounded hover:bg-red-700"
      >
        Sair
      </button>
    </aside>
  );
}

export default Sidebar;
