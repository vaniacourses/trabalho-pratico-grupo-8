import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Star, User } from "lucide-react";

function AvaliacaoCard({ avaliacao, tipo, onExcluir }) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User size={18} className="text-blue-600" />
          <span className="font-semibold text-gray-800">
            {tipo === "hospede" ? "Avaliação do Imóvel" : "Avaliação do Hóspede"}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
          <Star size={14} className="text-yellow-500" />
          <span className="text-sm font-medium text-yellow-700">
            {avaliacao.nota}/5
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600">{avaliacao.comentario}</p>

      {tipo === "hospede" && avaliacao.categorias && (
        <div className="grid grid-cols-2 gap-1 mt-1">
          {Object.entries(avaliacao.categorias).map(([cat, valor]) => (
            <div key={cat} className="flex justify-between text-xs text-gray-500">
              <span className="capitalize">{cat}</span>
              <span className="font-medium">{valor}/5</span>
            </div>
          ))}
        </div>
      )}

      <span className="text-xs text-gray-400">
        {new Date(avaliacao.data).toLocaleDateString("pt-BR")}
      </span>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => navigate(`/avaliacoes/editar/${avaliacao.id}`)}
          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600"
          title="Editar avaliação"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onExcluir(avaliacao.id)}
          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
          title="Excluir avaliação"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default AvaliacaoCard;