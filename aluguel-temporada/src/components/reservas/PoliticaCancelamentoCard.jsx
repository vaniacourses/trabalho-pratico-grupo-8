import { useNavigate } from "react-router-dom";
import { FileText, Clock, Percent } from "lucide-react";

function PoliticaCancelamentoCard({ politica, onExcluir }) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <FileText size={18} className="text-blue-600 mt-0.5" />
        <p className="text-sm text-gray-700">{politica.descricao}</p>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock size={14} />
        <span>Prazo mínimo: {politica.prazoMinimoDias} dia(s)</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Percent size={14} />
        <span>Reembolso: {politica.percentualReembolso}%</span>
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => navigate(`/politicas-cancelamento/editar/${politica.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm"
        >
          Editar
        </button>
        <button
          onClick={() => onExcluir(politica.id)}
          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-1.5 rounded-lg text-sm"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

export default PoliticaCancelamentoCard;
