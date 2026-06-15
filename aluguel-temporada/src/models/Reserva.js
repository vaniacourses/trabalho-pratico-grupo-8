import { criarEstado } from "../states/EstadosReserva";

class Reserva {
  constructor(dados) {
    this.id = dados.id ?? null;
    this.idImovel = dados.idImovel;
    this.idHospede = dados.idHospede;
    this.dataEntrada = dados.dataEntrada;
    this.dataSaida = dados.dataSaida;
    this.valorTotal = dados.valorTotal ?? 0;
    this.dataSolicitacao = dados.dataSolicitacao ?? new Date().toISOString();
    this._estado = criarEstado(dados.status ?? "Pendente");
    this.status = this._estado.getNome();
  }

  setEstado(estado) {
    this._estado = estado;
    this.status = estado.getNome();
  }

  getStatus() {
    return this._estado.getNome();
  }

  getAcoesDisponiveis() {
    return this._estado.getAcoesDisponiveis();
  }

  aceitarReserva()       { this._estado.aceitarReserva(this); }
  recusarReserva()       { this._estado.recusarReserva(this); }
  cancelarReserva()      { this._estado.cancelarReserva(this); }
  processarPagamento()   { this._estado.processarPagamento(this); }
  iniciarEstadia()       { this._estado.iniciarEstadia(this); }
  concluirEstadia()      { this._estado.concluirEstadia(this); }
  confirmar()            { this._estado.confirmar(this); }
  submeterAvaliacao()    { this._estado.submeterAvaliacao(this); }

  toJSON() {
    return {
      id: this.id,
      idImovel: this.idImovel,
      idHospede: this.idHospede,
      dataEntrada: this.dataEntrada,
      dataSaida: this.dataSaida,
      valorTotal: this.valorTotal,
      dataSolicitacao: this.dataSolicitacao,
      status: this.status,
    };
  }
}

export default Reserva;
