const calcularValorTotal = (precoPorNoite, dataInicio, dataFim) => {
  if (!precoPorNoite || !dataInicio || !dataFim) return 0;

  const inicio = new Date(dataInicio);
  const fim = new Date(dataFim);

  const diffMs = fim - inicio;
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias <= 0) return 0;

  return diffDias * precoPorNoite;
};

export { calcularValorTotal };