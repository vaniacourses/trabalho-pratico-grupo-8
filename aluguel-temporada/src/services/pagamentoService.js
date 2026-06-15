/**
 * pagamentoService.js — Contexto do Padrão GoF Strategy
 *
 * RESPONSABILIDADE:
 * Este serviço é o "Context" do padrão Strategy. Ele mantém uma referência
 * à estratégia de pagamento selecionada e delega a execução para ela,
 * sem saber (nem precisar saber) qual é a estratégia concreta em uso.
 *
 * Além disso, é responsável por toda a comunicação com a API local (json-server)
 * para persistir os registros de Pagamento.
 *
 * SOLID — DIP (Dependency Inversion Principle):
 * O serviço depende da abstração (PagamentoStrategy), não das implementações
 * concretas (PixStrategy, CartaoCreditoStrategy, etc.).
 *
 * SOLID — SRP (Single Responsibility Principle):
 * Este serviço tem uma única responsabilidade: orquestrar o fluxo de
 * pagamento — validar, delegar ao strategy, persistir e retornar o resultado.
 *
 * GRASP — Controlador (Controller):
 * Atua como ponto de entrada para as operações de pagamento, isolando
 * os componentes de UI da lógica de negócio e da persistência.
 */

import axios from "axios";
import { StrategyFactory } from "../strategies/PagamentoStrategies";

const API_URL = "http://localhost:3001";

const pagamentoService = {
  
  // OPERAÇÕES DE LEITURA

  /**
   * Lista todos os pagamentos cadastrados.
   * @returns {Promise<Array>} Lista de pagamentos.
   */
  listar: async () => {
    const response = await axios.get(`${API_URL}/pagamentos`);
    return response.data;
  },

  /**
   * Busca um pagamento específico pelo seu ID.
   * @param {string} id - ID do pagamento.
   * @returns {Promise<Object>} Dados do pagamento.
   */
  buscarPorId: async (id) => {
    const response = await axios.get(`${API_URL}/pagamentos/${id}`);
    return response.data;
  },

  /**
   * Busca todos os pagamentos associados a uma reserva.
   * @param {string} idReserva - ID da reserva.
   * @returns {Promise<Array>} Lista de pagamentos da reserva.
   */
  buscarPorReserva: async (idReserva) => {
    const response = await axios.get(
      `${API_URL}/pagamentos?idReserva=${idReserva}`
    );
    return response.data;
  },

  // CASO DE USO TRANSACIONAL — UC15: PROCESSAR PAGAMENTO


  /**
   * Processa o pagamento de uma reserva. Esta é a operação transacional
   * principal: ou tudo ocorre com sucesso, ou o estado anterior é preservado.
   *
   * FLUXO:
   * 1. Valida se a reserva existe e está com status "confirmada"
   * 2. Instancia a estratégia correta via StrategyFactory (Strategy Pattern)
   * 3. Delega o processamento para a estratégia concreta (API externa simulada)
   * 4. Persiste o registro de Pagamento no banco local
   * 5. Atualiza o status da Reserva para "aguardando_estadia"
   * Em caso de falha em qualquer etapa, nenhuma alteração é persistida.
   *
   * @param {string} idReserva - ID da reserva a ser paga.
   * @param {string} metodo - Método de pagamento: "pix" | "cartao_credito" | "boleto"
   * @param {Object} dadosEspecificos - Dados específicos do método escolhido.
   * @returns {Promise<Object>} Objeto do pagamento criado.
   */
  processar: async (idReserva, metodo, dadosEspecificos) => {
  
    // ETAPA 1 — Validar a reserva
  
    let reserva;
    try {
      const response = await axios.get(`${API_URL}/reservas/${idReserva}`);
      reserva = response.data;
    } catch {
      throw new Error(
        "Reserva não encontrada. Verifique o ID informado."
      );
    }

    if (reserva.status !== "confirmada") {
      throw new Error(
        `Não é possível processar o pagamento: a reserva está com status "${reserva.status}". ` +
          `Apenas reservas com status "confirmada" podem ser pagas.`
      );
    }

    // Verifica se já existe pagamento aprovado para essa reserva
    const pagamentosExistentes = await axios.get(
      `${API_URL}/pagamentos?idReserva=${idReserva}&status=aprovado`
    );
    if (pagamentosExistentes.data.length > 0) {
      throw new Error(
        "Esta reserva já possui um pagamento aprovado registrado."
      );
    }

    // ETAPA 2 — Instanciar a estratégia via StrategyFactory (Strategy Pattern)
    const strategy = StrategyFactory.criar(metodo);

    // ETAPA 3 — Delegar o processamento à estratégia concreta (API externa)
    const dadosPagamento = {
      ...dadosEspecificos,
      valor: reserva.valorTotal,
      descricao: `Pagamento da Reserva #${idReserva}`,
    };

    let resultadoAPI;
    try {
      resultadoAPI = await strategy.processar(dadosPagamento);
    } catch (error) {
      // Falha na API externa: registra o pagamento como "recusado" e lança o erro
      await axios.post(`${API_URL}/pagamentos`, {
        idReserva,
        valor: reserva.valorTotal,
        metodo,
        status: "recusado",
        dataPagamento: new Date().toISOString(),
        idTransacaoExterna: null,
      });
      throw new Error(`Falha no processamento: ${error.message}`, {
        cause: error,
      });
    }

    // ETAPA 4 — Persistir o Pagamento no banco local
    const novoPagamento = {
      idReserva,
      valor: reserva.valorTotal,
      metodo,
      status: resultadoAPI.status, // "aprovado" ou "pendente" (boleto)
      dataPagamento: new Date().toISOString(),
      idTransacaoExterna: resultadoAPI.idTransacaoExterna,
    };

    const pagamentoCriado = await axios.post(
      `${API_URL}/pagamentos`,
      novoPagamento
    );

    // ETAPA 5 — Atualizar o status da Reserva
    // O pagamento aprovado avança o ciclo de vida da reserva.
    // O boleto mantém a reserva "confirmada" até a compensação.
    if (resultadoAPI.status === "aprovado") {
      await axios.patch(`${API_URL}/reservas/${idReserva}`, {
        status: "aguardando_estadia",
      });
    }

    return pagamentoCriado.data;
  },

  // REEMBOLSO

  /**
   * Solicita o reembolso de um pagamento aprovado.
   * Utiliza a estratégia correta com base no método original do pagamento.
   *
   * @param {string} idPagamento - ID do pagamento a ser reembolsado.
   * @returns {Promise<Object>} Pagamento atualizado com status "reembolsado".
   */
  reembolsar: async (idPagamento) => {
    // Busca o pagamento
    const pagamento = (await axios.get(`${API_URL}/pagamentos/${idPagamento}`)).data;

    if (pagamento.status !== "aprovado") {
      throw new Error(
        `Não é possível reembolsar: o pagamento está com status "${pagamento.status}". ` +
          `Apenas pagamentos "aprovados" podem ser reembolsados.`
      );
    }

    // Usa a estratégia original do pagamento para solicitar o reembolso
    const strategy = StrategyFactory.criar(pagamento.metodo);
    await strategy.reembolsar(pagamento.idTransacaoExterna);

    // Atualiza o status do pagamento localmente
    const atualizado = await axios.patch(`${API_URL}/pagamentos/${idPagamento}`, {
      status: "reembolsado",
      dataReembolso: new Date().toISOString(),
    });

    return atualizado.data;
  },

  // CONSULTA DE STATUS

  /**
   * Consulta o status atual de um pagamento na API externa.
   * Útil para verificar compensação de boletos.
   *
   * @param {string} idPagamento - ID do pagamento local.
   * @returns {Promise<Object>} Status atualizado do pagamento.
   */
  consultarStatus: async (idPagamento) => {
    const pagamento = (await axios.get(`${API_URL}/pagamentos/${idPagamento}`)).data;

    if (!pagamento.idTransacaoExterna) {
      throw new Error("Este pagamento não possui uma transação externa registrada.");
    }

    const strategy = StrategyFactory.criar(pagamento.metodo);
    const statusExterno = await strategy.consultarStatus(
      pagamento.idTransacaoExterna
    );

    // Se o status mudou na API externa (ex: boleto compensado), atualiza localmente
    if (statusExterno.status !== pagamento.status) {
      await axios.patch(`${API_URL}/pagamentos/${idPagamento}`, {
        status: statusExterno.status,
      });
      return { ...pagamento, status: statusExterno.status };
    }

    return pagamento;
  },

  /**
   * Retorna os métodos de pagamento disponíveis para exibição na UI.
   * Delega para a StrategyFactory, mantendo a UI desacoplada das estratégias.
   * @returns {Array<{value: string, label: string}>}
   */
  listarMetodosDisponiveis: () => {
    return StrategyFactory.listarMetodos();
  },
};

export default pagamentoService;
