// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function ListaProdutos() {
//   const [produtos, setProdutos] = useState([]);

//   useEffect(() => {
//     buscarProdutos();
//   }, []);

//   const buscarProdutos = async () => {
//   try {
//     const res = await axios.get("http://localhost:5000/api/producao/recentes");
//     if (res.data.success) {
//       setProdutos(res.data.data);
//     }
//   } catch (err) {
//     console.error("Erro ao buscar produção:", err);
//   }
// };


//   const excluirProduto = async (id) => {
//     if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/producao/${id}`);
//       buscarProdutos(); // atualiza a lista
//     } catch (err) {
//       console.error("Erro ao excluir produto:", err);
//     }
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Últimos Produtos Cadastrados</h2>
//       {produtos.length === 0 ? (
//         <p>Nenhum produto cadastrado.</p>
//       ) : (
//         <ul className="space-y-3">
//           {produtos.map((p) => (
//   <li key={p.id} className="border p-3 rounded flex justify-between items-center">
//   <div>
//     <strong>{p.produto}</strong>
//     <div className="text-sm text-gray-600">
//       <strong>Código: {p.codProducao} | Data: {p.data} </strong>
//     </div>
//   </div>
//   <button
//     onClick={() => excluirProduto(p.id)}
//     className="bg-red-500 text-white px-3 py-1 rounded"
//   >
//     Excluir
//   </button>
// </li>

//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default ListaProdutos;
import React, { useEffect, useState } from "react";
import axios from "axios";

function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({});
  const [alerta, setAlerta] = useState({ tipo: "", mensagem: "" });
  
  


  useEffect(() => {
    buscarProdutos();
  }, []);

  const buscarProdutos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/producao/recentes");
      if (res.data.success) {
        setProdutos(res.data.data);
      }
    } catch (err) {
      console.error("Erro ao buscar produção:", err);
    }
  };

  const excluirProduto = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/producao/${id}`);
      buscarProdutos();
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
    }
  };

useEffect(() => {
  if (!editando) return; // só roda quando estiver editando

  // Calcula prodKg = prodM * 0.69
  const prodM = parseFloat(formData.prodM) || 0;
  const prodKg = +(prodM * 0.69).toFixed(2);

  // Calcula retalhoKg = retalhoM * 0.69
  const retalhoM = parseFloat(formData.retalhoM) || 0;
  const retalhoKg = +(retalhoM * 0.69).toFixed(2);

  // Soma hrsParada1, hrsParada2 e hrsParada3 para totalHorasParadas
  const hrs1 = parseFloat(formData.hrsParada1) || 0;
  const hrs2 = parseFloat(formData.hrsParada2) || 0;
  const hrs3 = parseFloat(formData.hrsParada3) || 0;
  const totalHorasParadas = +(hrs1 + hrs2 + hrs3).toFixed(2);

  // Atualiza o formData só se mudou algum valor pra evitar loop infinito
  if (
    formData.prodKg !== prodKg ||
    formData.retalhoKg !== retalhoKg ||
    formData.totalHorasParadas !== totalHorasParadas
  ) {
    setFormData((prev) => ({
      ...prev,
      prodKg,
      retalhoKg,
      totalHorasParadas,
    }));
  }
}, [
  editando,
  formData.prodM,
  formData.retalhoM,
  formData.hrsParada1,
  formData.hrsParada2,
  formData.hrsParada3,
  formData.prodKg,
  formData.retalhoKg,
  formData.totalHorasParadas,
]);

  const abrirEdicao = (produto) => {
    setFormData(produto);
    setEditando(produto.id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const salvarEdicao = async () => {
  try {
    // Converte data para o formato 'YYYY-MM-DD'
    const dataFormatada = formData.data ? formData.data.split('T')[0] : null;
    
    // Cria um novo objeto para enviar com a data formatada corretamente
    const dadosParaEnviar = { ...formData, data: dataFormatada };

    await axios.put(`http://localhost:5000/api/producao/${editando}`, dadosParaEnviar);
    setEditando(null);
    buscarProdutos();
    setAlerta({ tipo: "sucesso", mensagem: "Produto atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao salvar edição:", err);
    setAlerta({ tipo: "erro", mensagem: "Erro ao salvar as alterações." });
  }

  // Limpa o alerta após 4 segundos
  setTimeout(() => {
    setAlerta({ tipo: "", mensagem: "" });
  }, 4000);
};


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Últimos Produtos Cadastrados</h2>
      {alerta.mensagem && (
  <div
    className={`p-3 rounded mb-4 text-white ${
      alerta.tipo === "sucesso" ? "bg-green-500" : "bg-red-500"
    }`}
  >
    {alerta.mensagem}
  </div>
)}

      {produtos.length === 0 ? (
        <p>Nenhum produto cadastrado.</p>
      ) : (
        <ul className="space-y-3">
          {produtos.map((p) => (
            <li key={p.id} className="border p-3 rounded flex justify-between items-center">
              <div>
                <strong>{p.produto}</strong>
                <div className="text-sm text-gray-600">
                 <strong>Código: {p.codProducao} | Data: {p.data ? p.data.split('T')[0] : ""}</strong> 
                </div>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => abrirEdicao(p)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => excluirProduto(p.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editando && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-5xl max-h-screen overflow-y-auto">
      <h3 className="text-xl font-bold mb-4">Editar Produto</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input type="date" name="data" value={formData.data ? formData.data.split('T')[0] : ""} onChange={handleChange} className="input" />
        <input name="linha" value={formData.linha || ""} onChange={handleChange} placeholder="Linha" className="input" />
        <input name="codProducao" value={formData.codProducao || ""} onChange={handleChange} placeholder="Código de Produção" className="input" />
        <input name="produto" value={formData.produto || ""} onChange={handleChange} placeholder="Produto" className="input" />
        <input type="number" step="0.01" name="peso" value={formData.peso || ""} onChange={handleChange} placeholder="Peso" className="input" />
        <input name="codigo_of" value={formData.codigo_of || ""} onChange={handleChange} placeholder="Ordem de Fabricação (OF)" className="input" />
        <input type="number" name="prodM" value={formData.prodM || ""} onChange={handleChange} placeholder="Produção (m)" className="input" />
        <input type="number" name="prodKg" value={formData.prodKg || ""} placeholder="Produção (kg)" className="input" readOnly />
        <input type="number" name="refugo" value={formData.refugo || ""} onChange={handleChange} placeholder="Refugo (kg)" className="input" />
        <input name="motivoRefugo" value={formData.motivoRefugo || ""} onChange={handleChange} placeholder="Motivo Refugo" className="input" />
        <input type="number" name="retalhoM" value={formData.retalhoM || ""} onChange={handleChange} placeholder="Retalho (m)" className="input" />
        <input type="number" name="retalhoKg" value={formData.retalhoKg || ""} placeholder="Retalho (kg)" className="input" readOnly />
        <input name="motivoRetalho" value={formData.motivoRetalho || ""} onChange={handleChange} placeholder="Motivo Retalho" className="input" />
        <select name="houveParada" value={formData.houveParada || "Não"} onChange={handleChange} className="input">
          <option value="Não">Houve Parada? Não</option>
          <option value="Sim">Houve Parada? Sim</option>
        </select>

        {formData.houveParada === "Sim" &&
          [1, 2, 3].map((i) => (
            <React.Fragment key={i}>
              <input name={`codParada${i}`} value={formData[`codParada${i}`] || ""} onChange={handleChange} placeholder={`Código Parada ${i}`} className="input" />
              <input name={`descParada${i}`} value={formData[`descParada${i}`] || ""} onChange={handleChange} placeholder={`Motivo Parada ${i}`} className="input" />
              <input type="number" name={`hrsParada${i}`} value={formData[`hrsParada${i}`] || ""} onChange={handleChange} placeholder={`Horas Parada ${i}`} className="input" />
            </React.Fragment>
          ))}

        {formData.houveParada === "Sim" && (
          <input type="number" name="totalHorasParadas" value={formData.totalHorasParadas || ""} placeholder="Total Horas Paradas" className="input" readOnly />
        )}
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <button onClick={() => setEditando(null)} className="bg-gray-400 text-white px-4 py-2 rounded">
          Cancelar
        </button>
        <button onClick={salvarEdicao} className="bg-green-500 text-white px-4 py-2 rounded">
          Salvar
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default ListaProdutos;
