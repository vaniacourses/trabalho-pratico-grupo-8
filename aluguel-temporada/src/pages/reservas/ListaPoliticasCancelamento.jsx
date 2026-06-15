import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import politicaCancelamentoService from "../../services/politicaCancelamentoService";
import PoliticaCancelamentoCard from "../../components/reservas/PoliticaCancelamentoCard";

function ListaPoliticasCancelamento() {
  const navigate = useNavigate();
  const [politicas, setPoliticas] = useState([]);
  const [erro, setErro] = useState("");

  const carregar = async () => {
    try {
      const data = await politicaCancelamentoService.listar();
      setPoliticas(data);
    } catch {
      setErro("Erro ao carregar políticas de cancelamento.");
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja excluir esta política de cancelamento?")) return;
    try {
      await politicaCancelamentoService.excluir(id);
      await carregar();
    } catch {
      setErro("Erro ao excluir política de cancelamento.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Políticas de Cancelamento</h1>
        <button
          onClick={() => navigate("/politicas-cancelamento/cadastrar")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Nova Política
        </button>
      </div>

      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
          {erro}
        </div>
      )}

      {politicas.length === 0 ? (
        <p className="text-gray-500 text-sm">Nenhuma política de cancelamento cadastrada.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {politicas.map((politica) => (
            <PoliticaCancelamentoCard
              key={politica.id}
              politica={politica}
              onExcluir={handleExcluir}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaPoliticasCancelamento;
