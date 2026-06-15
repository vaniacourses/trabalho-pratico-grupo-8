/**
 * DetalhesPagamento.jsx — Visualização detalhada de um pagamento (Read do CRUD)
 *
 * Exibe todos os atributos do objeto Pagamento conforme o diagrama de classes:
 * id, idReserva, valor, metodo, status, dataPagamento, idTransacaoExterna.
 *
 * Também permite consultar o status atualizado via API externa (útil para
 * acompanhar a compensação de boletos bancários).
 *
 * SOLID — SRP: Responsabilidade única de exibir e permitir ações sobre
 * um único pagamento.
 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Calendar,
  Hash,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import pagamentoService from "../../services/pagamentoService";


// UTILITÁRIOS

const getStatusConfig = (status) => {
  const configs = {
    aprovado:    { label: "Aprovado",    classes: "bg-green-100 text-green-700",  Icone: CheckCircle },
    pendente:    { label: "Pendente",    classes: "bg-yellow-100 text-yellow-700", Icone: Clock       },
    recusado:    { label: "Recusado",    classes: "bg-red-100 text-red-700",      Icone: XCircle     },
    reembolsado: { label: "Reembolsado", classes: "bg-blue-100 text-blue-700",    Icone: RefreshCw   },
  };
  return configs[status] ?? { label: status, classes: "bg-gray-100 text-gray-700", Icone: Clock };
};

const getMetodoLabel = (metodo) => {
  const labels = {
    pix:           "Pix",
    cartao_credito: "Cartão de Crédito",
    boleto:        "Boleto Bancário",
  };
  return labels[metodo] ?? metodo;
};

const formatarMoeda = (valor) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

const formatarData = (dataISO) =>
  dataISO
    ? new Date(dataISO).toLocaleDateString("pt-BR", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";


// COMPONENTE

function DetalhesPagamento() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [pagamento, setPagamento] = useState(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [consultandoStatus, setConsultandoStatus] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await pagamentoService.buscarPorId(id);
        setPagamento(data);
      } catch {
        setErro("Pagamento não encontrado.");
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, [id]);

  const handleConsultarStatus = async () => {
    setConsultandoStatus(true);
    setErro("");
    setMensagemSucesso("");
    try {
      const atualizado = await pagamentoService.consultarStatus(id);
      setPagamento(atualizado);
      setMensagemSucesso("Status consultado com sucesso na API externa.");
    } catch (error) {
      setErro(error.message ?? "Erro ao consultar status.");
    } finally {
      setConsultandoStatus(false);
    }
  };

  const handleReembolsar = async () => {
    if (!window.confirm("Deseja solicitar o reembolso deste pagamento? Esta ação não pode ser desfeita.")) return;
    setErro("");
    setMensagemSucesso("");
    try {
      const atualizado = await pagamentoService.reembolsar(id);
      setPagamento(atualizado);
      setMensagemSucesso("Reembolso solicitado com sucesso.");
    } catch (error) {
      setErro(error.message ?? "Erro ao processar reembolso.");
    }
  };

  if (carregando) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-gray-500 text-sm">Carregando pagamento...</p>
      </div>
    );
  }

  if (!pagamento) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg">{erro}</div>
        <button
          onClick={() => navigate("/pagamentos")}
          className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft size={14} /> Voltar para Pagamentos
        </button>
      </div>
    );
  }

  const { label, classes, Icone } = getStatusConfig(pagamento.status);

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* Navegação */}
      <button
        onClick={() => navigate("/pagamentos")}
        className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-6"
      >
        <ArrowLeft size={14} /> Voltar para Pagamentos
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Detalhes do Pagamento</h1>

      {/* Feedback */}
      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">{erro}</div>
      )}
      {mensagemSucesso && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-4">{mensagemSucesso}</div>
      )}

      {/* Card de detalhes */}
      <div className="border rounded-lg bg-white shadow-sm p-6 flex flex-col gap-4">

        {/* Valor + Status */}
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-800">
            {formatarMoeda(pagamento.valor)}
          </span>
          <span className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full font-medium ${classes}`}>
            <Icone size={14} />
            {label}
          </span>
        </div>

        <hr className="border-gray-100" />

        {/* Dados do pagamento */}
        <div className="flex flex-col gap-3 text-sm text-gray-700">

          <div className="flex items-center gap-3">
            <CreditCard size={16} className="text-gray-400 shrink-0" />
            <div>
              <span className="text-xs text-gray-400 block">Método de Pagamento</span>
              <span className="font-medium">{getMetodoLabel(pagamento.metodo)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Hash size={16} className="text-gray-400 shrink-0" />
            <div>
              <span className="text-xs text-gray-400 block">ID da Reserva</span>
              <span className="font-mono text-xs">{pagamento.idReserva}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-gray-400 shrink-0" />
            <div>
              <span className="text-xs text-gray-400 block">Data do Pagamento</span>
              <span>{formatarData(pagamento.dataPagamento)}</span>
            </div>
          </div>

          {pagamento.dataReembolso && (
            <div className="flex items-center gap-3">
              <RefreshCw size={16} className="text-gray-400 shrink-0" />
              <div>
                <span className="text-xs text-gray-400 block">Data do Reembolso</span>
                <span>{formatarData(pagamento.dataReembolso)}</span>
              </div>
            </div>
          )}

          {pagamento.idTransacaoExterna && (
            <div className="flex items-center gap-3">
              <Hash size={16} className="text-gray-400 shrink-0" />
              <div>
                <span className="text-xs text-gray-400 block">ID da Transação Externa</span>
                <span className="font-mono text-xs break-all">{pagamento.idTransacaoExterna}</span>
              </div>
            </div>
          )}

          {/* Código de barras (boleto) */}
          {pagamento.codigoBarras && (
            <div className="flex items-start gap-3">
              <Hash size={16} className="text-gray-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs text-gray-400 block">Código de Barras</span>
                <span className="font-mono text-xs break-all">{pagamento.codigoBarras}</span>
              </div>
            </div>
          )}
        </div>

        {/* Mensagem informativa para boleto pendente */}
        {pagamento.metodo === "boleto" && pagamento.status === "pendente" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
            O boleto pode levar até 3 dias úteis para ser compensado. Clique em "Consultar Status" para verificar.
          </div>
        )}
      </div>

      {/* Ações */}
      <div className="flex gap-3 mt-6">
        {/* Consultar status — útil para boleto */}
        {pagamento.idTransacaoExterna && pagamento.status === "pendente" && (
          <button
            onClick={handleConsultarStatus}
            disabled={consultandoStatus}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            <RotateCcw size={14} />
            {consultandoStatus ? "Consultando..." : "Consultar Status"}
          </button>
        )}

        {/* Reembolso — apenas para aprovados */}
        {pagamento.status === "aprovado" && (
          <button
            onClick={handleReembolsar}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-5 py-2 rounded-lg text-sm"
          >
            Solicitar Reembolso
          </button>
        )}
      </div>
    </div>
  );
}

export default DetalhesPagamento;
