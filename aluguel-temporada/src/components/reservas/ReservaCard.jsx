import { useNavigate } from "react-router-dom";
import { Home, User, CalendarCheck, CalendarX, DollarSign } from "lucide-react";
import { STATUS_ESTILO, STATUS_LABEL, formatarData, formatarValor } from "../../utils/reservaUtils";

function ReservaCard({ reserva, imovelTitulo, hospedeNome, onExcluir }) {
  const navigate = useNavigate();
  const estilo = STATUS_ESTILO[reserva.status] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Home size={18} className="text-blue-600" />
          <span className="font-semibold text-gray-800">
            {imovelTitulo ?? reserva.idImovel}
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${estilo}`}>
          {STATUS_LABEL[reserva.status] ?? reserva.status}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <User size={14} />
        <span>{hospedeNome ?? reserva.idHospede}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <CalendarCheck size={14} />
        <span>Entrada: {formatarData(reserva.dataEntrada)}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <CalendarX size={14} />
        <span>Saída: {formatarData(reserva.dataSaida)}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <DollarSign size={14} />
        <span>{formatarValor(reserva.valorTotal)}</span>
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => navigate(`/reservas/${reserva.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm"
        >
          Detalhes
        </button>
        <button
          onClick={() => onExcluir(reserva.id)}
          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-1.5 rounded-lg text-sm"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

export default ReservaCard;
