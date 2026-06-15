import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import avaliacaoService from "../../services/avaliacaoService";

function EditarAvaliacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [erro, setErro] = useState("");

  // tipo controla qual coleção buscar e salvar
  const [tipo, setTipo] = useState("hospede");

  // campos de avaliação — não de imóvel
  const [form, setForm] = useState({
    imovelId: "",
    hospedeId: "",
    anfitriaoId: "",
    nota: 0,
    categorias: {
      limpeza: 0,
      localizacao: 0,
      custo: 0,
      comunicacao: 0,
    },
    comentario: "",
  });

  useEffect(() => {
    const carregar = async () => {
      try {
        // busca na coleção certa dependendo do tipo
        // se for hóspede busca em avaliacoes_imovel
        // se for anfitrião busca em avaliacoes_hospede
        const data =
          tipo === "hospede"
            ? await avaliacaoService.buscarAvaliacaoImovelPorId(id)
            : await avaliacaoService.buscarAvaliacaoHospedePorId(id);

        setForm(data);
      } catch (error) {
        console.error("Erro ao carregar avaliação:", error);
      }
    };

    carregar();
  }, [id, tipo]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategoria = (cat, valor) => {
    setForm({
      ...form,
      categorias: { ...form.categorias, [cat]: Number(valor) },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      if (!form.nota) throw new Error("Nota é obrigatória.");
      if (!form.comentario) throw new Error("Comentário é obrigatório.");
      if (form.comentario.length < 20)
        throw new Error("Comentário deve ter no mínimo 20 caracteres.");

      if (tipo === "hospede") {
        await avaliacaoService.atualizarAvaliacaoImovel(id, form);
      } else {
        await avaliacaoService.atualizarAvaliacaoHospede(id, form);
      }

      navigate("/avaliacoes");
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Editar Avaliação
      </h1>

      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Tipo de avaliação</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm"
          >
            <option value="hospede">Hóspede avalia o imóvel</option>
            <option value="anfitriao">Anfitrião avalia o hóspede</option>
          </select>
        </div>

        <input
          name="hospedeId"
          placeholder="ID do Hóspede"
          value={form.hospedeId}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        />

        {tipo === "hospede" && (
          <input
            name="imovelId"
            placeholder="ID do Imóvel"
            value={form.imovelId}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 text-sm"
          />
        )}

        {tipo === "anfitriao" && (
          <input
            name="anfitriaoId"
            placeholder="ID do Anfitrião"
            value={form.anfitriaoId}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 text-sm"
          />
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Nota geral (1 a 5)</label>
          <input
            name="nota"
            type="number"
            min={1}
            max={5}
            value={form.nota}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 text-sm"
          />
        </div>

        {/* categorias só aparecem para hóspede */}
        {tipo === "hospede" && (
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Categorias</label>
            {["limpeza", "localizacao", "custo", "comunicacao"].map((cat) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-28 capitalize">
                  {cat}
                </span>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.categorias[cat]}
                  onChange={(e) => handleCategoria(cat, e.target.value)}
                  className="border rounded-lg px-3 py-1 text-sm w-20"
                />
              </div>
            ))}
          </div>
        )}

        <textarea
          name="comentario"
          placeholder="Comentário (mínimo 20 caracteres)"
          value={form.comentario}
          onChange={handleChange}
          rows={3}
          className="border rounded-lg px-4 py-2 text-sm"
        />

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={() => navigate("/avaliacoes")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarAvaliacao;