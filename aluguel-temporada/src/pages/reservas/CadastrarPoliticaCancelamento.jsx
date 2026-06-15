import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PoliticaCancelamento from "../../models/PoliticaCancelamento";
import politicaCancelamentoService from "../../services/politicaCancelamentoService";

function CadastrarPoliticaCancelamento() {
  const navigate = useNavigate();
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    descricao: "",
    prazoMinimoDias: "",
    percentualReembolso: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      if (!form.descricao) throw new Error("Descrição é obrigatória.");
      if (form.prazoMinimoDias === "") throw new Error("Prazo mínimo é obrigatório.");
      if (form.percentualReembolso === "") throw new Error("Percentual de reembolso é obrigatório.");

      const politica = new PoliticaCancelamento({
        descricao: form.descricao,
        prazoMinimoDias: Number(form.prazoMinimoDias),
        percentualReembolso: Number(form.percentualReembolso),
      });

      await politicaCancelamentoService.criar(politica.toJSON());
      navigate("/politicas-cancelamento");
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nova Política de Cancelamento</h1>

      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-sm text-gray-600 flex flex-col gap-1">
          Descrição
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows={3}
            placeholder="Descreva as condições desta política..."
            className="border rounded-lg px-4 py-2 text-sm resize-none"
          />
        </label>

        <label className="text-sm text-gray-600 flex flex-col gap-1">
          Prazo mínimo para reembolso (dias antes da entrada)
          <input
            name="prazoMinimoDias"
            type="number"
            min="0"
            value={form.prazoMinimoDias}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 text-sm"
          />
        </label>

        <label className="text-sm text-gray-600 flex flex-col gap-1">
          Percentual de reembolso (%)
          <input
            name="percentualReembolso"
            type="number"
            min="0"
            max="100"
            value={form.percentualReembolso}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 text-sm"
          />
        </label>

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
          >
            Cadastrar
          </button>
          <button
            type="button"
            onClick={() => navigate("/politicas-cancelamento")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastrarPoliticaCancelamento;
