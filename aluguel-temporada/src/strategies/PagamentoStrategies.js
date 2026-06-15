/**
 * PagamentoStrategies — Estratégias Concretas (Padrão GoF: Strategy)
 *
 * Este arquivo reúne todas as implementações concretas do contrato definido
 * em PagamentoStrategy. Cada classe representa um método de pagamento distinto,
 * encapsulando sua lógica de integração com a API externa.
 *
 * SOLID — OCP (Open/Closed Principle):
 * Para adicionar um novo método de pagamento (ex: Cartão de Débito), basta
 * criar uma nova classe aqui que estenda PagamentoStrategy e registrá-la
 * no StrategyFactory. Nenhum código existente precisa ser alterado.
 *
 * SOLID — SRP (Single Responsibility Principle):
 * Cada classe tem uma única responsabilidade: saber como processar pagamentos
 * pelo seu método específico.
 *
 * GRASP — Especialista na Informação (Information Expert):
 * Cada estratégia é a especialista em como lidar com seu próprio método,
 * concentrando o conhecimento onde ele naturalmente pertence.
 */

import PagamentoStrategy from "./PagamentoStrategy";

// UTILITÁRIO INTERNO — Simulação de API externa de pagamentos
// Em produção, estas chamadas seriam substituídas pelo SDK/REST da API real.

/**
 * Simula uma chamada à API externa de pagamentos.
 * Gera um ID de transação único e retorna status aprovado.
 * Inclui delay para simular latência de rede.
 */
const simularChamadaAPI = async (metodo, dados) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simula falha em 5% dos casos (comportamento realista de API)
  if (Math.random() < 0.05) {
    throw new Error("Falha na comunicação com a API de pagamentos. Tente novamente.");
  }

  return {
    idTransacaoExterna: `TXN-${metodo.toUpperCase()}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`,
    status: "aprovado",
    timestamp: new Date().toISOString(),
    metodo,
    valor: dados.valor,
  };
};

/**
 * Simula consulta de status na API externa.
 */
const simularConsultaStatus = async (idTransacaoExterna) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    idTransacaoExterna,
    status: "aprovado",
    timestamp: new Date().toISOString(),
  };
};

/**
 * Simula solicitação de reembolso na API externa.
 */
const simularReembolso = async (idTransacaoExterna) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    idTransacaoExterna,
    status: "reembolsado",
    timestamp: new Date().toISOString(),
  };
};

// ESTRATÉGIA CONCRETA 1 — Pix

/**
 * PixStrategy — Processamento via Pix (transferência instantânea).
 *
 * Características específicas do Pix:
 * - Requer chave Pix do destinatário
 * - Confirmação instantânea (sem prazo de compensação)
 * - Reembolso disponível em até 90 dias
 */
export class PixStrategy extends PagamentoStrategy {
  async processar(dadosPagamento) {
    if (!dadosPagamento.chavePix) {
      throw new Error("Chave Pix é obrigatória para pagamentos via Pix.");
    }
    if (!dadosPagamento.valor || dadosPagamento.valor <= 0) {
      throw new Error("Valor inválido para pagamento via Pix.");
    }

    const resultado = await simularChamadaAPI("PIX", {
      chavePix: dadosPagamento.chavePix,
      valor: dadosPagamento.valor,
      descricao: dadosPagamento.descricao ?? "Reserva - Sistema de Hospedagem",
    });

    return resultado;
  }

  async reembolsar(idTransacaoExterna) {
    if (!idTransacaoExterna) {
      throw new Error("ID de transação necessário para reembolso via Pix.");
    }
    return await simularReembolso(idTransacaoExterna);
  }

  async consultarStatus(idTransacaoExterna) {
    return await simularConsultaStatus(idTransacaoExterna);
  }

  getNome() {
    return "Pix";
  }
}

// ESTRATÉGIA CONCRETA 2 — Cartão de Crédito

/**
 * CartaoCreditoStrategy — Processamento via Cartão de Crédito.
 *
 * Características específicas do Cartão de Crédito:
 * - Requer número, CVV, validade e nome do titular
 * - Suporta parcelamento
 * - Reembolso pode levar até 2 faturas para aparecer
 */
export class CartaoCreditoStrategy extends PagamentoStrategy {
  async processar(dadosPagamento) {
    const { numeroCartao, cvv, validade, nomeTitular, valor } = dadosPagamento;

    if (!numeroCartao || !cvv || !validade || !nomeTitular) {
      throw new Error(
        "Dados do cartão incompletos. Informe número, CVV, validade e nome do titular."
      );
    }
    if (!valor || valor <= 0) {
      throw new Error("Valor inválido para pagamento com cartão de crédito.");
    }

    // Validação básica de formato do cartão (16 dígitos)
    const numeroLimpo = numeroCartao.replace(/\s/g, "");
    if (numeroLimpo.length !== 16 || !/^\d+$/.test(numeroLimpo)) {
      throw new Error("Número do cartão inválido. Deve conter 16 dígitos.");
    }

    const resultado = await simularChamadaAPI("CARTAO_CREDITO", {
      // ATENÇÃO: Em produção, nunca envie dados brutos do cartão.
      // Use tokenização (ex: Stripe Elements, PagSeguro Transparent).
      numeroCartaoMascarado: `****${numeroLimpo.slice(-4)}`,
      nomeTitular,
      valor,
      parcelas: dadosPagamento.parcelas ?? 1,
    });

    return resultado;
  }

  async reembolsar(idTransacaoExterna) {
    if (!idTransacaoExterna) {
      throw new Error(
        "ID de transação necessário para reembolso no cartão de crédito."
      );
    }
    return await simularReembolso(idTransacaoExterna);
  }

  async consultarStatus(idTransacaoExterna) {
    return await simularConsultaStatus(idTransacaoExterna);
  }

  getNome() {
    return "Cartão de Crédito";
  }
}

// ESTRATÉGIA CONCRETA 3 — Boleto Bancário

/**
 * BoletoStrategy — Processamento via Boleto Bancário.
 *
 * Características específicas do Boleto:
 * - Compensação em até 3 dias úteis
 * - Requer CPF/CNPJ do pagador
 * - Reembolso via TED/PIX após cancelamento
 * - Vencimento configurável
 */
export class BoletoStrategy extends PagamentoStrategy {
  async processar(dadosPagamento) {
    const { cpfPagador, nomePagador, valor } = dadosPagamento;

    if (!cpfPagador || !nomePagador) {
      throw new Error(
        "CPF/CNPJ e nome do pagador são obrigatórios para emissão de boleto."
      );
    }
    if (!valor || valor <= 0) {
      throw new Error("Valor inválido para pagamento via boleto.");
    }

    const resultado = await simularChamadaAPI("BOLETO", {
      cpfPagador,
      nomePagador,
      valor,
      vencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 3 dias úteis
    });

    // Boleto retorna com status "pendente" até compensação
    return {
      ...resultado,
      status: "pendente",
      codigoBarras: `${Math.random().toString().substr(2, 47)}`,
      mensagem:
        "Boleto gerado. O pagamento será confirmado em até 3 dias úteis após o pagamento.",
    };
  }

  async reembolsar(idTransacaoExterna) {
    if (!idTransacaoExterna) {
      throw new Error("ID de transação necessário para reembolso de boleto.");
    }
    return await simularReembolso(idTransacaoExterna);
  }

  async consultarStatus(idTransacaoExterna) {
    return await simularConsultaStatus(idTransacaoExterna);
  }

  getNome() {
    return "Boleto Bancário";
  }
}

// FACTORY DE ESTRATÉGIAS

/**
 * StrategyFactory — Responsável por instanciar a estratégia correta com base
 * no método de pagamento informado.
 *
 * GRASP — Criador (Creator): a factory centraliza a criação das estratégias,
 * mantendo o PagamentoService desacoplado das classes concretas.
 *
 * Uso:
 *   const strategy = StrategyFactory.criar("pix");
 *   await strategy.processar(dadosPagamento);
 */
export class StrategyFactory {
  static #estrategias = {
    pix: () => new PixStrategy(),
    cartao_credito: () => new CartaoCreditoStrategy(),
    boleto: () => new BoletoStrategy(),
  };

  /**
   * Instancia a estratégia correspondente ao método informado.
   * @param {string} metodo - "pix" | "cartao_credito" | "boleto"
   * @returns {PagamentoStrategy} Instância da estratégia concreta.
   */
  static criar(metodo) {
    const factory = StrategyFactory.#estrategias[metodo];
    if (!factory) {
      throw new Error(
        `Método de pagamento não suportado: "${metodo}". ` +
          `Métodos válidos: ${Object.keys(StrategyFactory.#estrategias).join(", ")}.`
      );
    }
    return factory();
  }

  /**
   * Retorna a lista de métodos de pagamento disponíveis.
   * Útil para popular selects na interface.
   * @returns {Array<{value: string, label: string}>}
   */
  static listarMetodos() {
    return [
      { value: "pix", label: "Pix" },
      { value: "cartao_credito", label: "Cartão de Crédito" },
      { value: "boleto", label: "Boleto Bancário" },
    ];
  }
}
