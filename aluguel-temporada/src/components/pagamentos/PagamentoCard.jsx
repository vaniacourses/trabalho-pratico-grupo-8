/**
 * PagamentoCard.jsx — Componente de exibição de um Pagamento
 *
 * SOLID — SRP (Single Responsibility Principle):
 * Este componente tem uma única responsabilidade: exibir os dados resumidos
 * de um pagamento em formato de card. Ele não contém lógica de negócio,
 * não faz chamadas à API e não gerencia estado global — apenas recebe props
 * e renderiza.
 *
 * GRASP — Especialista na Informação (Information Expert):
 * O componente conhece apenas o que precisa para exibir um pagamento:
 * os dados do objeto `pagamento` e os callbacks de ação (`onReembolsar`,
 * `onVerDetalhes`). Toda lógica de negócio permanece no serviço.
 */

import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Calendar,
  Hash,
} from "lucide-react";


// UTILITÁRIOS DE EXIBIÇÃO (privados ao componente)

/**
 * Retorna label, classes de cor e ícone de acordo com o status do pagamento.
 * Reflete os estados do Diagrama de Estado (Figura 23) da documentação.
 */
const getStatusConfig = (status) => {
  const configs = {
    aprovado: {
      label: "Aprovado",
      classes: "bg-green-100 text-green-700",
      Icone: CheckCircle,
    },
    pendente: {
      label: "Pendente",
      classes: "bg-yellow-100 text-yellow-700",
      Icone: Clock,
    },
    recusado: {
      label: "Recusado",
      classes: "bg-red-100 text-red-700",
      Icone: XCircle,
    },
    reembolsado: {
      label: "Reembolsado",
      classes: "bg-blue-100 text-blue-700",
      Icone: RefreshCw,
    },
  };
  return configs[status] ?? { label: status, classes: "bg-gray-100 text-gray-700", Icone: Clock };
};

/**
 * Retorna o label legível do método de pagamento.
 */
const getMetodoLabel = (metodo) => {
  const labels = {
    pix: "Pix",
    cartao_credito: "Cartão de Crédito",
    boleto: "Boleto Bancário",
  };
  return labels[metodo] ?? metodo;
};

/**
 * Formata um valor numérico como moeda brasileira (BRL).
 */
const formatarMoeda = (valor) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);

/**
 * Formata uma string ISO de data para o padrão brasileiro.
 */
const formatarData = (dataISO) =>
  new Date(dataISO).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// COMPONENTE

/**
 * @param {Object}   pagamento      - Objeto completo do pagamento.
 * @param {Function} onReembolsar   - Callback chamado ao solicitar reembolso.
 */
function PagamentoCard({ pagamento, onReembolsar }) {
  const navigate = useNavigate();
  const { label, classes, Icone } = getStatusConfig(pagamento.status);

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2">

      {/* Cabeçalho: ícone + valor + badge de status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard size={18} className="text-blue-600" />
          <span className="font-semibold text-gray-800">
            {formatarMoeda(pagamento.valor)}
          </span>
        </div>
        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${classes}`}>
          <Icone size={12} />
          {label}
        </span>
      </div>

      {/* Método de pagamento */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <CreditCard size={14} />
        <span>{getMetodoLabel(pagamento.metodo)}</span>
      </div>

      {/* ID da reserva vinculada */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Hash size={14} />
        <span>Reserva: <span className="font-mono text-xs">{pagamento.idReserva}</span></span>
      </div>

      {/* Data do pagamento */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Calendar size={14} />
        <span>Pago em: {formatarData(pagamento.dataPagamento)}</span>
      </div>

      {/* ID da transação externa (quando disponível) */}
      {pagamento.idTransacaoExterna && (
        <div className="text-xs text-gray-400 font-mono truncate">
          Transação: {pagamento.idTransacaoExterna}
        </div>
      )}

      {/* Ações */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => navigate(`/pagamentos/${pagamento.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm"
        >
          Ver Detalhes
        </button>

        {/* Reembolso só disponível para pagamentos aprovados */}
        {pagamento.status === "aprovado" && (
          <button
            onClick={() => onReembolsar(pagamento.id)}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-1.5 rounded-lg text-sm"
          >
            Reembolsar
          </button>
        )}
      </div>
    </div>
  );
}

export default PagamentoCard;
