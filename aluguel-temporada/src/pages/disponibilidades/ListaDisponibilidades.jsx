import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";
import disponibilidadeService from "../../services/disponibilidadeService";
import DisponibilidadeCard from "../../components/disponibilidade/DisponibilidadeCard";

function ListaDisponibilidades() {
  const { idImovel } = useParams();
  const navigate = useNavigate();
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await disponibilidadeService.listarPorImovel(idImovel);
        setDisponibilidades(data);
      } catch (error) {
        console.error("Erro ao carregar disponibilidades:", error);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [idImovel]);

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja excluir este período?")) return;
    try {
      await disponibilidadeService.excluir(id);
      setDisponibilidades((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error("Erro ao excluir disponibilidade:", error);
    }
  };

  const handleEditar = (disponibilidade) => {
    navigate(`/imoveis/${idImovel}/disponibilidades/editar/${disponibilidade.id}`);
  };

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/imoveis")}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800 flex-1">
          Disponibilidade do Imóvel
        </h1>
        <button
          onClick={() => navigate(`/imoveis/${idImovel}/disponibilidades/cadastrar`)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Novo Período
        </button>
      </div>

      {disponibilidades.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          Nenhum período cadastrado.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {disponibilidades.map((d) => (
            <DisponibilidadeCard
              key={d.id}
              disponibilidade={d}
              onEditar={handleEditar}
              onExcluir={handleExcluir}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaDisponibilidades;