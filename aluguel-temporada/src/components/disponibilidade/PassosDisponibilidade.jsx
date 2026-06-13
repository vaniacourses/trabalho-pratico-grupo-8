import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import disponibilidadeService from "../../services/disponibilidadeService";

registerLocale("pt-BR", ptBR);

function PassosDisponibilidade({ onConcluir, onPular }) {
  const [erro, setErro] = useState("");
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [disponivel, setDisponivel] = useState(true);
  const [periodos, setPeriodos] = useState([]);

  const handleAdicionarPeriodo = () => {
    setErro("");

    try {
      if (!dataInicio) throw new Error("Data de início é obrigatória.");
      if (!dataFim) throw new Error("Data de fim é obrigatória.");
      if (dataFim <= dataInicio) throw new Error("Data de fim deve ser após a data de início.");

      const temSobreposicao = disponibilidadeService.verificarSobreposicao(
        periodos,
        dataInicio,
        dataFim
      );

      if (temSobreposicao) {
        throw new Error("Este período se sobrepõe a um já adicionado.");
      }

      setPeriodos((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}`,
          dataInicio: dataInicio.toISOString(),
          dataFim: dataFim.toISOString(),
          disponivel,
        },
      ]);

      setDataInicio(null);
      setDataFim(null);
      setDisponivel(true);
    } catch (error) {
      setErro(error.message);
    }
  };

  const handleRemoverPeriodo = (id) => {
    setPeriodos((prev) => prev.filter((p) => p.id !== id));
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Disponibilidade</h2>
      <p className="text-sm text-gray-500 mb-4">
        Adicione os períodos em que seu imóvel estará disponível ou bloqueado.
        Você pode adicionar quantos períodos quiser antes de continuar.
      </p>

      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
          {erro}
        </div>
      )}

      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Data de Início</label>
          <DatePicker
            selected={dataInicio}
            onChange={(date) => setDataInicio(date)}
            selectsStart
            startDate={dataInicio}
            endDate={dataFim}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            locale="pt-BR"
            placeholderText="Selecione a data de início"
            className="border rounded-lg px-4 py-2 text-sm w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Data de Fim</label>
          <DatePicker
            selected={dataFim}
            onChange={(date) => setDataFim(date)}
            selectsEnd
            startDate={dataInicio}
            endDate={dataFim}
            minDate={dataInicio || new Date()}
            dateFormat="dd/MM/yyyy"
            locale="pt-BR"
            placeholderText="Selecione a data de fim"
            className="border rounded-lg px-4 py-2 text-sm w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Status do Período</label>
          <select
            value={disponivel}
            onChange={(e) => setDisponivel(e.target.value === "true")}
            className="border rounded-lg px-4 py-2 text-sm"
          >
            <option value="true">Disponível</option>
            <option value="false">Bloqueado</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleAdicionarPeriodo}
          className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm border border-blue-200"
        >
          + Adicionar Período
        </button>
      </div>

      {periodos.length > 0 && (
        <div className="flex flex-col gap-2 mb-6">
          <h3 className="text-sm font-semibold text-gray-700">
            Períodos adicionados:
          </h3>
          {periodos.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    p.disponivel
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.disponivel ? "Disponível" : "Bloqueado"}
                </span>
                <span className="text-sm text-gray-700">
                  {formatarData(p.dataInicio)} → {formatarData(p.dataFim)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoverPeriodo(p.id)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={() => onConcluir(periodos)}
          disabled={periodos.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm"
        >
          Próximo →
        </button>
        <button
          type="button"
          onClick={onPular}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-2 rounded-lg text-sm"
        >
          Pular por agora
        </button>
      </div>
    </div>
  );
}

export default PassosDisponibilidade;