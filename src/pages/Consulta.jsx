import React, { useState } from "react";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;


function ConsultaProdutos() {
  const [codigo, setCodigo] = useState("");
  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState("");

  const buscarProduto = async () => {
    try {
      const res = await axios.get(`${API}/api/producao/total/${codigo}`);

      if (res.data.success) {
        setProduto(res.data.data);
        setErro("");
      } else {
        setProduto(null);
        setErro("Produto não encontrado.");
      }
    } catch (err) {
      setProduto(null);
      setErro("Erro ao buscar produto.");
    }
  };

  return (
    <div className="p-6 ml-64">
      <h1 className="text-2xl font-bold mb-4">Consulta de Produtos</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Digite o código do produto"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          className="p-2 border border-gray-400 rounded mr-2"
        />
        <button
          onClick={buscarProduto}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {erro && <p className="text-red-600">{erro}</p>}

     {produto && (
  <div className="bg-gray-100 p-4 rounded shadow-md w-full max-w-md">
    <p><strong>Código do Produto:</strong> {produto.codProducao}</p>
    <p><strong>Produto:</strong> {produto.produto}</p>
    <p><strong>Total Produzido (Metros):</strong> {produto.total_metros} m</p>
    <p><strong>Total Produzido (Peso):</strong> {produto.total_kg} kg</p>
  </div>
)}

    </div>
  );
}

export default ConsultaProdutos;
