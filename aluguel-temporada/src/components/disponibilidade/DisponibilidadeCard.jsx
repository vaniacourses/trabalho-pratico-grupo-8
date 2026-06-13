import { Pencil, Trash2 } from "lucide-react";

function DisponibilidadeCard({ disponibilidade, onEditar, onExcluir }) {
  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              disponibilidade.disponivel
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {disponibilidade.disponivel ? "Disponível" : "Bloqueado"}
          </span>
        </div>
        <span className="text-sm text-gray-700">
          {formatarData(disponibilidade.dataInicio)} →{" "}
          {formatarData(disponibilidade.dataFim)}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEditar(disponibilidade)}
          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onExcluir(disponibilidade.id)}
          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default DisponibilidadeCard;