// src/pages/Formulario.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
const API = import.meta.env.VITE_API_URL;
axios.get(`${API}/api/produto/${formData.codProducao}`);
axios.post(`${API}/api/formulario`, dadosComUsuario);

function Formulario() {
  const { usuario } = useAuth();
  const [formData, setFormData] = useState(inicializarFormulario());
  const [mensagem, setMensagem] = useState(null);
  
useEffect(() => {
  const delayDebounce = setTimeout(() => {
    const buscarProduto = async () => {
      if (formData.codProducao.trim() === "") return;
      console.log("Buscando produto:", formData.codProducao);

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/produto/${formData.codProducao}`);
        console.log("Resposta da API:", res.data); // <= Adicione isso também
        if (res.data.success) {
          setFormData((prev) => ({
            ...prev,
            produto: res.data.data.nome_produto,
            peso: res.data.data.peso,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            produto: "",
            peso: "",
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar produto:", err);
        setFormData((prev) => ({
          ...prev,
          produto: "",
          peso: "",
        }));
      }
    };

    buscarProduto();
  }, 500); // Aguarda 500ms após digitação

  return () => clearTimeout(delayDebounce);
}, [formData.codProducao]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const hoje = new Date();
    const dataFormatada = hoje.toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, data: dataFormatada }));
  }, []);

  function inicializarFormulario() {
    return {
      data: "",
      linha: "",
      codProducao: "",
      produto: "",
      peso: "",
      codigo_of: "",
      prodM: "",
      prodKg: "",
      refugo: "",
      motivoRefugo: "",
      retalhoM: "",
      retalhoKg: "",
      motivoRetalho: "",
      houveParada: "Não",
      codParada1: "",
      descParada1: "",
      hrsParada1: "",
      codParada2: "",
      descParada2: "",
      hrsParada2: "",
      codParada3: "",
      descParada3: "",
      hrsParada3: "",
      totalHorasParadas: "",
    };
  }

  useEffect(() => {
    const peso = parseFloat(formData.peso) || 0;
    const prodM = parseFloat(formData.prodM) || 0;
    const retalhoM = parseFloat(formData.retalhoM) || 0;
    const h1 = parseFloat(formData.hrsParada1) || 0;
    const h2 = parseFloat(formData.hrsParada2) || 0;
    const h3 = parseFloat(formData.hrsParada3) || 0;

    setFormData((prev) => ({
      ...prev,
      prodKg: (prodM * peso).toFixed(2),
      retalhoKg: (retalhoM * peso).toFixed(2),
      totalHorasParadas: (h1 + h2 + h3).toFixed(2),
    }));
  }, [
    formData.peso,
    formData.prodM,
    formData.retalhoM,
    formData.hrsParada1,
    formData.hrsParada2,
    formData.hrsParada3,
  ]);

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizar = (val) => val === "" ? null : val;
    const dadosComUsuario = {
      ...formData,
      usuario: usuario.usuario,
      setor: usuario.setor,
      turno: usuario.turno,
        hrsParada1: sanitizar(formData.hrsParada1),
  hrsParada2: sanitizar(formData.hrsParada2),
  hrsParada3: sanitizar(formData.hrsParada3),
  totalHorasParadas: sanitizar(formData.totalHorasParadas),
    };

    try {
      console.log("Dados sendo enviados:", dadosComUsuario);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/formulario`, dadosComUsuario);
      console.log("Resposta da API:", res.data);
      if (res.data.success) {
        setMensagem({ tipo: "sucesso", texto: "Dados enviados com sucesso!" });
        setFormData(inicializarFormulario());
        const hoje = new Date().toISOString().split("T")[0];
        setFormData((prev) => ({ ...prev, data: hoje }));
        setTimeout(() => setMensagem(null), 2000);
      } else {
        setMensagem({ tipo: "erro", texto: "Erro ao enviar os dados." });
      }
    } catch (err) {
      console.error("Erro ao enviar dados:", err);
      setMensagem({ tipo: "erro", texto: "Erro ao conectar com o servidor." });
    }
  };

  if (!usuario) {
    return <div className="p-6 text-center text-gray-600">Carregando usuário...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4">Formulário de Produção</h2>
        <p className="text-sm text-gray-600 mb-4">
          Usuario: <strong>{usuario.usuario}</strong> | Setor: <strong>{usuario.setor}</strong> | Turno: <strong>{usuario.turno}</strong>
        </p>

        {mensagem && (
          <div
            className={`mb-4 p-3 rounded text-white ${
              mensagem.tipo === "erro" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="label">Data</label>
          <input type="date" name="data" value={formData.data} readOnly className="input col-span-2" />

          <label className="label">Linha</label>
          <input type="text" name="linha" value={formData.linha} onChange={handleChange} className="input col-span-2" />

          <label className="label">Código de Produção</label>
          <input type="text" name="codProducao" value={formData.codProducao} onChange={handleChange} className="input col-span-2" />

          <label className="label">Produto</label>
          <input type="text" name="produto" value={formData.produto} onChange={handleChange} className="input col-span-2" />

          <label className="label">Peso</label>
          <input type="text" name="peso" value={formData.peso} onChange={handleChange} className="input col-span-2" />

          <label className="label">OF</label>
          <input type="text" name="codigo_of" value={formData.codigo_of} onChange={handleChange} className="input col-span-2" />

          <label className="label">Produção (m)</label>
          <input type="number" name="prodM" value={formData.prodM} onChange={handleChange} className="input col-span-2" />

          <label className="label">Produção (kg)</label>
          <input type="text" name="prodKg" value={formData.prodKg} readOnly className="input col-span-2" />

          <label className="label">Refugo (kg)</label>
          <input type="number" name="refugo" value={formData.refugo} onChange={handleChange} className="input col-span-2" />

          <label className="label">Motivo do Refugo</label>
          <input type="text" name="motivoRefugo" value={formData.motivoRefugo} onChange={handleChange} className="input col-span-2" />

          <label className="label">Retalho (m)</label>
          <input type="number" name="retalhoM" value={formData.retalhoM} onChange={handleChange} className="input col-span-2" />

          <label className="label">Retalho (kg)</label>
          <input type="text" name="retalhoKg" value={formData.retalhoKg} readOnly className="input col-span-2" />

          <label className="label">Motivo do Retalho</label>
          <input type="text" name="motivoRetalho" value={formData.motivoRetalho} onChange={handleChange} className="input col-span-2" />

          <label className="label">Houve Parada?</label>
          <select name="houveParada" value={formData.houveParada} onChange={handleChange} className="select col-span-2">
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>

          {formData.houveParada === "Sim" && (
            <>
              {[1, 2, 3].map((i) => (
                <React.Fragment key={i}>
                  <label className="label">{`Código Parada ${i}`}</label>
                  <input
                    type="text"
                    name={`codParada${i}`}
                    value={formData[`codParada${i}`]}
                    onChange={handleChange}
                    className="input col-span-2"
                  />

                  <label className="label">{`Motivo ${i}`}</label>
                  <input
                    type="text"
                    name={`descParada${i}`}
                    value={formData[`descParada${i}`]}
                    onChange={handleChange}
                    className="input col-span-2"
                  />

                  <label className="label">{`Horas Paradas ${i}`}</label>
                  <input
                    type="number"
                    name={`hrsParada${i}`}
                    value={formData[`hrsParada${i}`]}
                    onChange={handleChange}
                    className="input col-span-2"
                  />
                </React.Fragment>
              ))}
              <label className="label">Total Horas Paradas</label>
              <input type="text" name="totalHorasParadas" value={formData.totalHorasParadas} readOnly className="input col-span-2" />
            </>
          )}

          <button type="submit" className="button col-span-full">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Formulario;
