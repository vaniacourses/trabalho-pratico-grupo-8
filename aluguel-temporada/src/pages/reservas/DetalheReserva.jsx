import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Home, User, CalendarCheck, CalendarX, DollarSign, ArrowLeft } from "lucide-react";
import Reserva from "../../models/Reserva";
import PoliticaCancelamento from "../../models/PoliticaCancelamento";
import reservaService from "../../services/reservaService";
import imovelService from "../../services/imovelService";
import usuarioService from "../../services/usuarioService";
import politicaCancelamentoService from "../../services/politicaCancelamentoService";
import { STATUS_ESTILO, STATUS_LABEL, ACOES_CONFIG, formatarData, formatarValor } from "../../utils/reservaUtils";

function DetalheReserva() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reserva, setReserva] = useState(null);
  const [imovel, setImovel] = useState(null);
  const [hospede, setHospede] = useState(null);
  const [politica, setPolitica] = useState(null);
  const [confirmacaoCancelamento, setConfirmacaoCancelamento] = useState(null);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const dados = await reservaService.buscarPorId(id);
        const reservaObj = new Reserva(dados);
        setReserva(reservaObj);

        const carregas = [
          imovelService.buscarPorId(dados.idImovel),
          usuarioService.buscarPorId(dados.idHospede),
        ];
        if (dados.idPoliticaCancelamento) {
          carregas.push(politicaCancelamentoService.buscarPorId(dados.idPoliticaCancelamento));
        }

        const [imovelData, hospedaData, politicaData] = await Promise.all(carregas);
        setImovel(imovelData);
        setHospede(hospedaData);
        if (politicaData) setPolitica(new PoliticaCancelamento(politicaData));
      } catch {
        setErro("Erro ao carregar reserva.");
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [id]);

  const executarAcao = async (nomeAcao) => {
    setErro("");

    if (nomeAcao === "cancelarReserva" && reserva.status === "Paga" && politica) {
      setConfirmacaoCancelamento(politica.calcularReembolso(reserva));
      return;
    }

    try {
      reserva[nomeAcao]();
      await reservaService.atualizar(reserva.id, reserva.toJSON());
      setReserva(new Reserva(reserva.toJSON()));
    } catch (error) {
      setErro(error.message);
    }
  };

  const confirmarCancelamento = async () => {
    try {
      reserva.cancelarReserva();
      const dados = { ...reserva.toJSON(), valorReembolso: confirmacaoCancelamento.valorReembolso };
      await reservaService.atualizar(reserva.id, dados);
      setReserva(new Reserva(dados));
      setConfirmacaoCancelamento(null);
    } catch (error) {
      setErro(error.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Carregando...</p>;
  if (!reserva) return <p className="text-center mt-10 text-red-600">{erro}</p>;

  const badgeEstilo = STATUS_ESTILO[reserva.status] ?? "bg-gray-100 text-gray-600";
  const acoes = reserva.getAcoesDisponiveis();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/reservas")}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Detalhes da Reserva</h1>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full font-medium ${badgeEstilo}`}>
          {STATUS_LABEL[reserva.status] ?? reserva.status}
        </span>
      </div>

      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
          {erro}
        </div>
      )}

      <div className="bg-white border rounded-lg p-5 flex flex-col gap-3 shadow-sm">
        <div className="flex items-center gap-2 text-gray-800">
          <Home size={18} className="text-blue-600" />
          <span className="font-semibold">{imovel?.titulo ?? reserva.idImovel}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User size={15} />
          <span>{hospede?.nome ?? reserva.idHospede}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarCheck size={15} />
          <span>Entrada: {formatarData(reserva.dataEntrada)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarX size={15} />
          <span>Saída: {formatarData(reserva.dataSaida)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign size={15} />
          <span>{formatarValor(reserva.valorTotal)}</span>
        </div>

        <p className="text-xs text-gray-400 mt-1">
          Solicitada em {formatarData(reserva.dataSolicitacao)}
        </p>
      </div>

      {confirmacaoCancelamento && (
        <div className="mt-6 border rounded-lg p-4 bg-orange-50 border-orange-200 flex flex-col gap-3">
          <p className="text-sm font-semibold text-orange-800">Política de cancelamento aplicável</p>
          <p className="text-sm text-orange-700">
            {confirmacaoCancelamento.diasRestantes} dia(s) até a entrada.
          </p>
          {confirmacaoCancelamento.temDireito ? (
            <p className="text-sm text-green-700 font-medium">
              Você tem direito a reembolso de{" "}
              <span className="font-bold">{formatarValor(confirmacaoCancelamento.valorReembolso)}</span>.
            </p>
          ) : (
            <p className="text-sm text-red-700 font-medium">
              Cancelamento fora do prazo — sem direito a reembolso.
            </p>
          )}
          <div className="flex gap-2 mt-1">
            <button
              onClick={confirmarCancelamento}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Confirmar cancelamento
            </button>
            <button
              onClick={() => setConfirmacaoCancelamento(null)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm"
            >
              Voltar
            </button>
          </div>
        </div>
      )}

      {!confirmacaoCancelamento && acoes.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-3">Ações disponíveis neste estado:</p>
          <div className="flex flex-wrap gap-3">
            {acoes.map((acao) => {
              const config = ACOES_CONFIG[acao];
              return (
                <button
                  key={acao}
                  onClick={() => executarAcao(acao)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${config.estilo}`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!confirmacaoCancelamento && acoes.length === 0 && (
        <p className="mt-6 text-sm text-gray-400 text-center">
          Nenhuma ação disponível neste estado.
        </p>
      )}
    </div>
  );
}

export default DetalheReserva;
