import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import imovelService from "../../services/imovelService";
import ImovelCard from "../../components/imovel/ImovelCard";

function ListaImoveis() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await imovelService.listar();
        setImoveis(data);
      } catch (error) {
        console.error("Erro ao carregar imóveis:", error);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, []);

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja excluir este imóvel?")) return;
    try {
      await imovelService.excluir(id);
      setImoveis((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Erro ao excluir imóvel:", error);
    }
  };

  const handleEditar = (imovel) => {
    navigate(`/imoveis/editar/${imovel.id}`);
  };

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Imóveis</h1>
        <button
          onClick={() => navigate("/imoveis/novo")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Novo Imóvel
        </button>
      </div>

      {imoveis.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Nenhum imóvel cadastrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {imoveis.map((imovel) => (
            <ImovelCard
              key={imovel.id}
              imovel={imovel}
              onEditar={handleEditar}
              onExcluir={handleExcluir}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaImoveis;