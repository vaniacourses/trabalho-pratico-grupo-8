import { useState } from "react";
import { useNavigate } from "react-router-dom";
import denunciaService from "../../services/denunciaService";

// opções fixas de tipo de denúncia
const TIPOS_DENUNCIA = [
  "Anúncio falso ou enganoso",
  "Imóvel diferente das fotos",
  "Golpe / fraude financeira",
  "Comportamento abusivo do anfitrião",
  "Condições de higiene inadequadas",
  "Outro",
];

// tags que o usuário pode selecionar
const TAGS_DISPONIVEIS = [
  "Fotos enganosas",
  "Cobrança indevida",
  "Segurança",
  "Privacidade",
  "Cancelamento injusto",
  "Não respondeu",
];

function CadastrarDenuncia() {
  const navigate = useNavigate();
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    imovelId: "",
    usuarioId: "",
    tipo: "",
    descricao: "",
    status: "Em análise", // sempre começa como "Em análise"
  });

  // tags são uma lista separada pois funcionam diferente
  // o usuário pode selecionar várias ao mesmo tempo
  const [tagsSelecionadas, setTagsSelecionadas] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // adiciona ou remove a tag da lista quando o usuário clica
  // se já estava selecionada, remove — se não estava, adiciona
  const handleTag = (tag) => {
    setTagsSelecionadas((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      if (!form.imovelId) throw new Error("ID do imóvel é obrigatório.");
      if (!form.usuarioId) throw new Error("ID do usuário é obrigatório.");
      if (!form.tipo) throw new Error("Tipo da denúncia é obrigatório.");
      if (!form.descricao) throw new Error("Descrição é obrigatória.");
      if (form.descricao.length < 20)
        throw new Error("Descrição deve ter no mínimo 20 caracteres.");

      // monta o objeto com tudo junto incluindo as tags
      await denunciaService.criar({
        ...form,
        tags: tagsSelecionadas,
        data: new Date().toISOString(),
      });

      navigate("/denuncias");
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Registrar Denúncia
      </h1>

      {/* aviso explicativo no topo */}
      <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg mb-4 text-sm">
        Denúncias são analisadas em até 48h. Use este canal somente para
        situações que violam os termos de uso.
      </div>

      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="imovelId"
          placeholder="ID do Imóvel"
          value={form.imovelId}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        />

        <input
          name="usuarioId"
          placeholder="ID do Usuário"
          value={form.usuarioId}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        />

        <select
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        >
          <option value="">Selecione o motivo</option>
          {TIPOS_DENUNCIA.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>

        {/* tags clicáveis — muda de cor quando selecionada */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-600">
            Pontos envolvidos (opcional)
          </label>
          <div className="flex flex-wrap gap-2">
            {TAGS_DISPONIVEIS.map((tag) => (
              <button
                key={tag}
                type="button" // importante: evita submeter o form ao clicar
                onClick={() => handleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  tagsSelecionadas.includes(tag)
                    ? "bg-blue-100 border-blue-400 text-blue-700"
                    : "bg-white border-gray-300 text-gray-600"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <textarea
          name="descricao"
          placeholder="Descreva o ocorrido com data, horário e detalhes..."
          value={form.descricao}
          onChange={handleChange}
          rows={4}
          className="border rounded-lg px-4 py-2 text-sm"
        />

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
          >
            Enviar Denúncia
          </button>
          <button
            type="button"
            onClick={() => navigate("/denuncias")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default CadastrarDenuncia;