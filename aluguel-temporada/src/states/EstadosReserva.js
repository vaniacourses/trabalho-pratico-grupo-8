class EstadoReserva {
  getNome() {
    throw new Error("getNome() não implementado.");
  }

  getAcoesDisponiveis() {
    return [];
  }

  aceitarReserva(_reserva) {
    throw new Error(`Ação 'aceitarReserva' não permitida no estado '${this.getNome()}'.`);
  }

  recusarReserva(_reserva) {
    throw new Error(`Ação 'recusarReserva' não permitida no estado '${this.getNome()}'.`);
  }

  cancelarReserva(_reserva) {
    throw new Error(`Ação 'cancelarReserva' não permitida no estado '${this.getNome()}'.`);
  }

  processarPagamento(_reserva) {
    throw new Error(`Ação 'processarPagamento' não permitida no estado '${this.getNome()}'.`);
  }

  iniciarEstadia(_reserva) {
    throw new Error(`Ação 'iniciarEstadia' não permitida no estado '${this.getNome()}'.`);
  }

  concluirEstadia(_reserva) {
    throw new Error(`Ação 'concluirEstadia' não permitida no estado '${this.getNome()}'.`);
  }

  confirmar(_reserva) {
    throw new Error(`Ação 'confirmar' não permitida no estado '${this.getNome()}'.`);
  }

  submeterAvaliacao(_reserva) {
    throw new Error(`Ação 'submeterAvaliacao' não permitida no estado '${this.getNome()}'.`);
  }
}

class PendenteState extends EstadoReserva {
  getNome() { return "Pendente"; }

  getAcoesDisponiveis() {
    return ["aceitarReserva", "recusarReserva", "cancelarReserva"];
  }

  aceitarReserva(reserva) {
    reserva.setEstado(new AguardandoPagamentoState());
  }

  recusarReserva(reserva) {
    reserva.setEstado(new RecusadaState());
  }

  cancelarReserva(reserva) {
    reserva.setEstado(new CanceladaState());
  }
}

class AguardandoPagamentoState extends EstadoReserva {
  getNome() { return "AguardandoPagamento"; }

  getAcoesDisponiveis() {
    return ["processarPagamento", "cancelarReserva"];
  }

  processarPagamento(reserva) {
    reserva.setEstado(new PagaState());
  }

  cancelarReserva(reserva) {
    reserva.setEstado(new CanceladaState());
  }
}

class PagaState extends EstadoReserva {
  getNome() { return "Paga"; }

  getAcoesDisponiveis() {
    return ["iniciarEstadia", "cancelarReserva"];
  }

  iniciarEstadia(reserva) {
    reserva.setEstado(new EmAndamentoState());
  }

  cancelarReserva(reserva) {
    reserva.setEstado(new CanceladaState());
  }
}

class EmAndamentoState extends EstadoReserva {
  getNome() { return "EmAndamento"; }

  getAcoesDisponiveis() {
    return ["concluirEstadia"];
  }

  concluirEstadia(reserva) {
    reserva.setEstado(new ConcluidaState());
  }
}

class ConcluidaState extends EstadoReserva {
  getNome() { return "Concluida"; }

  getAcoesDisponiveis() {
    return ["confirmar"];
  }

  confirmar(reserva) {
    reserva.setEstado(new ConfirmadaState());
  }
}

class ConfirmadaState extends EstadoReserva {
  getNome() { return "Confirmada"; }

  getAcoesDisponiveis() {
    return ["submeterAvaliacao"];
  }

  submeterAvaliacao(reserva) {
    reserva.setEstado(new AvaliadaState());
  }
}

class AvaliadaState extends EstadoReserva {
  getNome() { return "Avaliada"; }
}

class RecusadaState extends EstadoReserva {
  getNome() { return "Recusada"; }
}

class CanceladaState extends EstadoReserva {
  getNome() { return "Cancelada"; }
}

const ESTADOS = {
  Pendente: PendenteState,
  AguardandoPagamento: AguardandoPagamentoState,
  Paga: PagaState,
  EmAndamento: EmAndamentoState,
  Concluida: ConcluidaState,
  Confirmada: ConfirmadaState,
  Avaliada: AvaliadaState,
  Recusada: RecusadaState,
  Cancelada: CanceladaState,
};

const criarEstado = (status) => {
  const EstadoClass = ESTADOS[status];
  if (!EstadoClass) throw new Error(`Estado desconhecido: '${status}'.`);
  return new EstadoClass();
};

export {
  EstadoReserva,
  PendenteState,
  AguardandoPagamentoState,
  PagaState,
  EmAndamentoState,
  ConcluidaState,
  ConfirmadaState,
  AvaliadaState,
  RecusadaState,
  CanceladaState,
  criarEstado,
};
