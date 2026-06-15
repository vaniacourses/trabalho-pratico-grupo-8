import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import avaliacaoService from "../../services/avaliacaoService";
import AvaliacaoCard from "../../components/avaliacao/AvaliacaoCard";

function ListaAvaliacoes() {
  const [avaliacoesImovel, setAvaliacoesImovel] = useState([]);
  const [avaliacoesHospede, setAvaliacoesHospede] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregar = async () => {
      try {
        const [imovel, hospede] = await Promise.all([
          avaliacaoService.listarPorImovel(""),
          avaliacaoService.listarPorHospede(""),
        ]);
        setAvaliacoesImovel(imovel);
        setAvaliacoesHospede(hospede);
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, []);

  const handleExcluirImovel = async (id) => {
    if (!window.confirm("Deseja excluir esta avaliação?")) return;
    try {
      await avaliacaoService.excluirAvaliacaoImovel(id);
      setAvaliacoesImovel((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
    }
  };

  const handleExcluirHospede = async (id) => {
    if (!window.confirm("Deseja excluir esta avaliação?")) return;
    try {
      await avaliacaoService.excluirAvaliacaoHospede(id);
      setAvaliacoesHospede((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Avaliações</h1>
        <button
          onClick={() => navigate("/avaliacoes/cadastrar")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Nova Avaliação
        </button>
      </div>

      {/* avaliações de imóveis */}
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Avaliações de Imóveis
      </h2>
      {avaliacoesImovel.length === 0 ? (
        <p className="text-center text-gray-500 mb-6">
          Nenhuma avaliação de imóvel cadastrada.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {avaliacoesImovel.map((av) => (
            <AvaliacaoCard
              key={av.id}
              avaliacao={av}
              tipo="hospede"
              onExcluir={handleExcluirImovel}
            />
          ))}
        </div>
      )}

      {/* avaliações de hóspedes */}
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Avaliações de Hóspedes
      </h2>
      {avaliacoesHospede.length === 0 ? (
        <p className="text-center text-gray-500">
          Nenhuma avaliação de hóspede cadastrada.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {avaliacoesHospede.map((av) => (
            <AvaliacaoCard
              key={av.id}
              avaliacao={av}
              tipo="anfitriao"
              onExcluir={handleExcluirHospede}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaAvaliacoes;