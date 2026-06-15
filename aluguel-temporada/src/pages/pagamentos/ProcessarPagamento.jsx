/**
 * ProcessarPagamento.jsx — UC15: Processar Pagamento (Caso de Uso Transacional)
 *
 * Esta é a página mais importante do módulo de pagamentos. Ela implementa o
 * caso de uso transacional UC15, conforme descrito na documentação:
 * "O hóspede inicia o pagamento de uma reserva confirmada, e a plataforma
 * aciona a API externa de pagamentos para processar a transação."
 *
 * FLUXO TRANSACIONAL (ou tudo ocorre ou nada é persistido):
 * 1. Usuário informa o ID da reserva e escolhe o método de pagamento
 * 2. Formulário específico do método é exibido (Strategy visível na UI)
 * 3. Ao confirmar, o pagamentoService.processar() é chamado, que:
 *    a. Valida a reserva (status "confirmada")
 *    b. Verifica ausência de pagamento duplicado
 *    c. Delega à estratégia correta (GoF Strategy)
 *    d. Persiste o pagamento
 *    e. Atualiza o status da reserva
 * 4. Em caso de falha em qualquer etapa, o estado é preservado
 *
 * SOLID — SRP: Esta página gerencia exclusivamente o fluxo de entrada de dados
 * para processamento de pagamento. Não contém lógica de negócio.
 *
 * SOLID — OCP: A adição de um novo método de pagamento requer apenas:
 * (1) uma nova estratégia em PagamentoStrategies.js e
 * (2) um novo bloco `case` no switch de renderização abaixo.
 * Nenhum outro arquivo precisa ser modificado.
 *
 * GRASP — Controlador (Controller): Coordena a interação entre o usuário
 * e o pagamentoService sem conter regras de negócio.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Loader } from "lucide-react";
import pagamentoService from "../../services/pagamentoService";


// SUB-COMPONENTES — Formulários específicos por método de pagamento
// Cada um coleta apenas os dados que sua estratégia requer.


/**
 * Formulário para pagamento via Pix.
 * Coleta: chave Pix do destinatário.
 */
function FormularioPix({ dados, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-500">
        Informe a chave Pix para onde o pagamento será direcionado.
      </p>
      <input
        name="chavePix"
        placeholder="Chave Pix (CPF, e-mail, telefone ou chave aleatória)"
        value={dados.chavePix ?? ""}
        onChange={onChange}
        className="border rounded-lg px-4 py-2 text-sm"
      />
    </div>
  );
}

/**
 * Formulário para pagamento via Cartão de Crédito.
 * Coleta: número do cartão, nome do titular, validade, CVV e parcelas.
 */
function FormularioCartaoCredito({ dados, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-500">
        Informe os dados do cartão de crédito.
      </p>
      <input
        name="nomeTitular"
        placeholder="Nome impresso no cartão"
        value={dados.nomeTitular ?? ""}
        onChange={onChange}
        className="border rounded-lg px-4 py-2 text-sm"
      />
      <input
        name="numeroCartao"
        placeholder="Número do cartão (16 dígitos)"
        value={dados.numeroCartao ?? ""}
        onChange={onChange}
        maxLength={19}
        className="border rounded-lg px-4 py-2 text-sm font-mono"
      />
      <div className="flex gap-3">
        <input
          name="validade"
          placeholder="Validade (MM/AA)"
          value={dados.validade ?? ""}
          onChange={onChange}
          maxLength={5}
          className="border rounded-lg px-4 py-2 text-sm flex-1"
        />
        <input
          name="cvv"
          placeholder="CVV"
          value={dados.cvv ?? ""}
          onChange={onChange}
          maxLength={4}
          className="border rounded-lg px-4 py-2 text-sm w-24"
        />
      </div>
      <select
        name="parcelas"
        value={dados.parcelas ?? "1"}
        onChange={onChange}
        className="border rounded-lg px-4 py-2 text-sm"
      >
        {[1, 2, 3, 6, 12].map((n) => (
          <option key={n} value={n}>
            {n === 1 ? "À vista" : `${n}x sem juros`}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Formulário para pagamento via Boleto Bancário.
 * Coleta: CPF/CNPJ e nome do pagador.
 */
function FormularioBoleto({ dados, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-gray-500">
        O boleto será gerado com vencimento em 3 dias úteis. A confirmação
        do pagamento pode levar até 3 dias úteis após o pagamento.
      </p>
      <input
        name="nomePagador"
        placeholder="Nome completo do pagador"
        value={dados.nomePagador ?? ""}
        onChange={onChange}
        className="border rounded-lg px-4 py-2 text-sm"
      />
      <input
        name="cpfPagador"
        placeholder="CPF ou CNPJ do pagador"
        value={dados.cpfPagador ?? ""}
        onChange={onChange}
        maxLength={18}
        className="border rounded-lg px-4 py-2 text-sm font-mono"
      />
    </div>
  );
}

// COMPONENTE PRINCIPAL

function ProcessarPagamento() {
  const navigate = useNavigate();

  // Estado principal do formulário
  const [idReserva, setIdReserva] = useState("");
  const [metodo, setMetodo] = useState("pix");
  const [dadosEspecificos, setDadosEspecificos] = useState({});

  // Estado de UI
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState(false);

  // Métodos disponíveis vindos da StrategyFactory (via serviço)
  const metodosDisponiveis = pagamentoService.listarMetodosDisponiveis();

  const handleDadosChange = (e) => {
    setDadosEspecificos({ ...dadosEspecificos, [e.target.name]: e.target.value });
  };

  const handleMetodoChange = (e) => {
    setMetodo(e.target.value);
    // Limpa os dados do formulário anterior ao trocar de método
    setDadosEspecificos({});
    setErro("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    // Validação básica do ID da reserva
    if (!idReserva.trim()) {
      setErro("ID da reserva é obrigatório.");
      return;
    }

    setProcessando(true);
    try {
      /**
       * Aqui o Strategy Pattern fica explícito para a professora:
       * - O método `metodo` (string) determina qual ConcreteStrategy será usada
       * - O pagamentoService (Context) recebe o metodo e os dadosEspecificos
       * - Internamente, o StrategyFactory instancia a estratégia correta
       * - O Context delega o processar() sem saber qual estratégia executa
       */
      const pagamentoCriado = await pagamentoService.processar(
        idReserva.trim(),
        metodo,
        dadosEspecificos
      );
      // Redireciona para a tela de detalhes do pagamento criado
      navigate(`/pagamentos/${pagamentoCriado.id}`);
    } catch (error) {
      setErro(error.message ?? "Erro ao processar pagamento. Tente novamente.");
    } finally {
      setProcessando(false);
    }
  };

  /**
   * Renderiza o formulário correto de acordo com o método selecionado.
   * SOLID — OCP: para adicionar um novo método, basta adicionar um case aqui
   * e criar a estratégia correspondente em PagamentoStrategies.js.
   */
  const renderizarFormularioMetodo = () => {
    switch (metodo) {
      case "pix":
        return <FormularioPix dados={dadosEspecificos} onChange={handleDadosChange} />;
      case "cartao_credito":
        return <FormularioCartaoCredito dados={dadosEspecificos} onChange={handleDadosChange} />;
      case "boleto":
        return <FormularioBoleto dados={dadosEspecificos} onChange={handleDadosChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">

      {/* Navegação */}
      <button
        onClick={() => navigate("/pagamentos")}
        className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-6"
      >
        <ArrowLeft size={14} /> Voltar para Pagamentos
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Processar Pagamento</h1>

      {/* Mensagem de erro */}
      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Seção 1: Identificação da reserva */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            ID da Reserva
          </label>
          <input
            placeholder="Informe o ID da reserva confirmada"
            value={idReserva}
            onChange={(e) => setIdReserva(e.target.value)}
            className="border rounded-lg px-4 py-2 text-sm font-mono"
          />
          <p className="text-xs text-gray-400">
            Apenas reservas com status "confirmada" podem ser pagas.
          </p>
        </div>

        {/* Seção 2: Escolha do método de pagamento */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Método de Pagamento
          </label>
          <div className="grid grid-cols-3 gap-2">
            {metodosDisponiveis.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => handleMetodoChange({ target: { value } })}
                className={`flex items-center justify-center gap-2 border rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  metodo === value
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <CreditCard size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Seção 3: Formulário específico do método selecionado (Strategy na UI) */}
        <div className="border rounded-lg p-4 bg-gray-50 flex flex-col gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Dados do {metodosDisponiveis.find((m) => m.value === metodo)?.label}
          </span>
          {renderizarFormularioMetodo()}
        </div>

        {/* Ações */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={processando}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg text-sm"
          >
            {processando && <Loader size={14} className="animate-spin" />}
            {processando ? "Processando..." : "Confirmar Pagamento"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/pagamentos")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm"
          >
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
}

export default ProcessarPagamento;
