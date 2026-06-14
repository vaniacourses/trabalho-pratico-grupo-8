/**
 * PagamentoStrategy — Interface / Classe Abstrata (Padrão GoF: Strategy)
 *
 * PADRÃO STRATEGY — CONTEXTO DE USO:
 * O sistema de hospedagem precisa processar pagamentos por diferentes métodos
 * (Pix, Cartão de Crédito, Boleto, etc.). Sem o Strategy, a lógica de cada
 * método ficaria acumulada em condicionais (if/else ou switch) dentro do
 * serviço de pagamento, violando o Princípio Aberto/Fechado (SOLID - OCP):
 * qualquer novo método exigiria alterar o código existente.
 *
 * PROBLEMA QUE RESOLVE:
 * Encapsula cada algoritmo de processamento de pagamento em sua própria classe,
 * tornando-os intercambiáveis sem alterar o código que os utiliza.
 *
 * JUSTIFICATIVA DA ESCOLHA:
 * O Strategy é ideal aqui pois: (1) o comportamento de processar varia por
 * método; (2) novos métodos de pagamento podem ser adicionados sem modificar
 * código existente; (3) o contexto (PagamentoService) não precisa saber qual
 * estratégia está usando — apenas chama processar().
 *
 * PARTICIPANTES DO PADRÃO:
 *  - Strategy (interface):      PagamentoStrategy       ← este arquivo
 *  - ConcreteStrategy A:        PixStrategy
 *  - ConcreteStrategy B:        CartaoCreditoStrategy
 *  - ConcreteStrategy C:        BoletoStrategy
 *  - Context:                   PagamentoService
 */

/**
 * Classe base que define o contrato (interface) para todas as estratégias
 * de pagamento. Em JavaScript, simulamos a interface com uma classe abstrata
 * que lança erros caso os métodos não sejam sobrescritos pelas subclasses.
 *
 * GRASP — Polimorfismo: cada estratégia concreta responde à mesma mensagem
 * (processar, reembolsar, consultarStatus) com comportamentos distintos,
 * eliminando condicionais baseadas em tipo.
 */
class PagamentoStrategy {
  /**
   * Processa o pagamento conforme o método específico.
   * @param {Object} dadosPagamento - Dados necessários para o processamento.
   * @returns {Promise<Object>} Resultado com idTransacaoExterna e status.
   */
  async processar(dadosPagamento) {
    throw new Error(
      `${this.constructor.name} deve implementar o método processar().`
    );
  }

  /**
   * Solicita o reembolso de uma transação previamente processada.
   * @param {string} idTransacaoExterna - ID retornado pela API externa.
   * @returns {Promise<Object>} Resultado do reembolso.
   */
  async reembolsar(idTransacaoExterna) {
    throw new Error(
      `${this.constructor.name} deve implementar o método reembolsar().`
    );
  }

  /**
   * Consulta o status atual de uma transação na API externa.
   * @param {string} idTransacaoExterna - ID retornado pela API externa.
   * @returns {Promise<Object>} Status atual da transação.
   */
  async consultarStatus(idTransacaoExterna) {
    throw new Error(
      `${this.constructor.name} deve implementar o método consultarStatus().`
    );
  }

  /**
   * Retorna o nome legível do método de pagamento.
   * Útil para exibição na interface.
   * @returns {string}
   */
  getNome() {
    throw new Error(
      `${this.constructor.name} deve implementar o método getNome().`
    );
  }
}

export default PagamentoStrategy;
