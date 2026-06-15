const STATUS_ESTILO = {
  Pendente:             "bg-yellow-100 text-yellow-700",
  AguardandoPagamento:  "bg-orange-100 text-orange-700",
  Paga:                 "bg-blue-100 text-blue-700",
  EmAndamento:          "bg-indigo-100 text-indigo-700",
  Concluida:            "bg-teal-100 text-teal-700",
  Confirmada:           "bg-green-100 text-green-700",
  Avaliada:             "bg-emerald-100 text-emerald-700",
  Recusada:             "bg-red-100 text-red-700",
  Cancelada:            "bg-gray-200 text-gray-600",
};

const STATUS_LABEL = {
  Pendente:             "Pendente",
  AguardandoPagamento:  "Aguardando Pagamento",
  Paga:                 "Paga",
  EmAndamento:          "Em Andamento",
  Concluida:            "Concluída",
  Confirmada:           "Confirmada",
  Avaliada:             "Avaliada",
  Recusada:             "Recusada",
  Cancelada:            "Cancelada",
};

const formatarData = (data) =>
  data ? new Date(data).toLocaleDateString("pt-BR") : "—";

const formatarValor = (valor) =>
  (valor ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const ACOES_CONFIG = {
  aceitarReserva:     { label: "Aceitar Reserva",      estilo: "bg-green-600 hover:bg-green-700 text-white" },
  recusarReserva:     { label: "Recusar Reserva",      estilo: "bg-red-600 hover:bg-red-700 text-white" },
  cancelarReserva:    { label: "Cancelar Reserva",     estilo: "bg-gray-200 hover:bg-gray-300 text-gray-700" },
  processarPagamento: { label: "Processar Pagamento",  estilo: "bg-blue-600 hover:bg-blue-700 text-white" },
  iniciarEstadia:     { label: "Iniciar Estadia",      estilo: "bg-indigo-600 hover:bg-indigo-700 text-white" },
  concluirEstadia:    { label: "Concluir Estadia",     estilo: "bg-teal-600 hover:bg-teal-700 text-white" },
  confirmar:          { label: "Confirmar Estadia",    estilo: "bg-green-600 hover:bg-green-700 text-white" },
  submeterAvaliacao:  { label: "Submeter Avaliação",   estilo: "bg-emerald-600 hover:bg-emerald-700 text-white" },
};

const ESTADOS_ATIVOS = ["Pendente", "AguardandoPagamento", "Paga", "EmAndamento"];

const soData = (dateStr) => {
  const d = new Date(dateStr);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const verificarDisponibilidadeParaReserva = (
  disponibilidades,
  reservasExistentes,
  idImovel,
  dataEntrada,
  dataSaida,
) => {
  const entrada = soData(dataEntrada);
  const saida = soData(dataSaida);

  const periodoDisponivel = disponibilidades
    .filter((d) => d.idImovel === idImovel && d.disponivel)
    .some((d) => {
      const inicio = soData(d.dataInicio);
      const fim = soData(d.dataFim);
      return entrada >= inicio && saida <= fim;
    });

  if (!periodoDisponivel) {
    return {
      disponivel: false,
      motivo: "O imóvel não possui disponibilidade cadastrada para o período selecionado.",
    };
  }

  const temConflito = reservasExistentes
    .filter((r) => r.idImovel === idImovel && ESTADOS_ATIVOS.includes(r.status))
    .some((r) => {
      const rEntrada = soData(r.dataEntrada);
      const rSaida = soData(r.dataSaida);
      return entrada < rSaida && saida > rEntrada;
    });

  if (temConflito) {
    return {
      disponivel: false,
      motivo: "Já existe uma reserva ativa para este imóvel no período selecionado.",
    };
  }

  return { disponivel: true };
};

export { STATUS_ESTILO, STATUS_LABEL, ACOES_CONFIG, formatarData, formatarValor, verificarDisponibilidadeParaReserva };
