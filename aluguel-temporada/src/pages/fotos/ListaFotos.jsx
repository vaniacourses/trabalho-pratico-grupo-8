import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";
import fotoService from "../../services/fotoService";
import FotoCard from "../../components/foto/FotoCard";

function ListaFotos() {
  const { idImovel } = useParams();
  const navigate = useNavigate();
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await fotoService.listarPorImovel(idImovel);
        setFotos(data);
      } catch (error) {
        console.error("Erro ao carregar fotos:", error);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [idImovel]);

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja excluir esta foto?")) return;
    try {
      await fotoService.excluir(id);
      setFotos((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Erro ao excluir foto:", error);
    }
  };

  const handleEditar = (foto) => {
    navigate(`/imoveis/${idImovel}/fotos/editar/${foto.id}`);
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
        <h1 className="text-2xl font-bold text-gray-800 flex-1">Fotos do Imóvel</h1>
        <button
          onClick={() => navigate(`/imoveis/${idImovel}/fotos/cadastrar`)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Nova Foto
        </button>
      </div>

      {fotos.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Nenhuma foto cadastrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fotos.map((foto) => (
            <FotoCard
              key={foto.id}
              foto={foto}
              onEditar={handleEditar}
              onExcluir={handleExcluir}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaFotos;