/**
 * ListaPagamentos.jsx — Listagem de todos os pagamentos (Read do CRUD)
 *
 * SOLID — SRP: Esta página tem uma única responsabilidade: carregar e exibir
 * a lista de pagamentos, delegando a lógica de negócio ao pagamentoService
 * e a renderização de cada item ao PagamentoCard.
 *
 * GRASP — Controlador (Controller): Atua como intermediário entre a interface
 * e o serviço, coordenando o carregamento de dados e as ações do usuário
 * (reembolsar) sem conter lógica de negócio própria.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import pagamentoService from "../../services/pagamentoService";
import PagamentoCard from "../../components/pagamentos/PagamentoCard";

function ListaPagamentos() {
  const navigate = useNavigate();
  const [pagamentos, setPagamentos] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  const carregarPagamentos = async () => {
    try {
      setCarregando(true);
      const data = await pagamentoService.listar();
      setPagamentos(data);
    } catch {
      setErro("Erro ao carregar pagamentos. Verifique se o servidor está rodando.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true);
        const data = await pagamentoService.listar();
        setPagamentos(data);
      } catch {
        setErro("Erro ao carregar pagamentos. Verifique se o servidor está rodando.");
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, []);

  const handleReembolsar = async (id) => {
    if (!window.confirm("Deseja solicitar o reembolso deste pagamento? Esta ação não pode ser desfeita.")) return;
    try {
      await pagamentoService.reembolsar(id);
      await carregarPagamentos();
    } catch (error) {
      setErro(error.message ?? "Erro ao processar reembolso.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pagamentos</h1>
        <button
          onClick={() => navigate("/pagamentos/processar")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Processar Pagamento
        </button>
      </div>

      {/* Mensagem de erro */}
      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
          {erro}
        </div>
      )}

      {/* Estado de carregamento */}
      {carregando ? (
        <p className="text-gray-500 text-sm">Carregando pagamentos...</p>
      ) : pagamentos.length === 0 ? (
        <p className="text-gray-500 text-sm">Nenhum pagamento registrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pagamentos.map((pagamento) => (
            <PagamentoCard
              key={pagamento.id}
              pagamento={pagamento}
              onReembolsar={handleReembolsar}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaPagamentos;
