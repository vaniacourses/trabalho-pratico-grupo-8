class PoliticaCancelamento {
  constructor(dados) {
    this.id = dados.id ?? null;
    this.descricao = dados.descricao ?? "";
    this.prazoMinimoDias = dados.prazoMinimoDias ?? 0;
    this.percentualReembolso = dados.percentualReembolso ?? 0;
  }

  calcularReembolso(reserva) {
    const agora = new Date();
    const entrada = new Date(reserva.dataEntrada);
    const diasRestantes = Math.floor((entrada - agora) / (1000 * 60 * 60 * 24));
    const temDireito = diasRestantes >= this.prazoMinimoDias;
    const valorReembolso = temDireito
      ? reserva.valorTotal * (this.percentualReembolso / 100)
      : 0;
    return { temDireito, diasRestantes, valorReembolso };
  }

  editar(dados) {
    if (dados.descricao !== undefined) this.descricao = dados.descricao;
    if (dados.prazoMinimoDias !== undefined) this.prazoMinimoDias = dados.prazoMinimoDias;
    if (dados.percentualReembolso !== undefined) this.percentualReembolso = dados.percentualReembolso;
  }

  toJSON() {
    return {
      id: this.id,
      descricao: this.descricao,
      prazoMinimoDias: this.prazoMinimoDias,
      percentualReembolso: this.percentualReembolso,
    };
  }
}

export default PoliticaCancelamento;
