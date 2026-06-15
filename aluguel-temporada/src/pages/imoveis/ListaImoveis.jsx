import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Plus, Search, X } from "lucide-react";
import imovelService from "../../services/imovelService";
import ImovelCard from "../../components/imovel/ImovelCard";

function ListaImoveis() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    termo: "",
    tipoImovel: "",
    status: "",
    precoMaximo: "",
  });
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

  const tiposDisponiveis = useMemo(() => {
    return [...new Set(imoveis.map((imovel) => imovel.tipoImovel).filter(Boolean))].sort();
  }, [imoveis]);

  const imoveisFiltrados = useMemo(() => {
    const termoNormalizado = filtros.termo.trim().toLowerCase();
    const precoMaximo = filtros.precoMaximo ? Number(filtros.precoMaximo) : null;

    return imoveis.filter((imovel) => {
      const textoBusca = [
        imovel.titulo,
        imovel.descricao,
        imovel.endereco,
        imovel.tipoImovel,
        imovel.regras,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const correspondeTermo = !termoNormalizado || textoBusca.includes(termoNormalizado);
      const correspondeTipo = !filtros.tipoImovel || imovel.tipoImovel === filtros.tipoImovel;
      const correspondeStatus = !filtros.status || imovel.status === filtros.status;
      const correspondePreco =
        !precoMaximo || Number(imovel.precoPorNoite) <= precoMaximo;

      return correspondeTermo && correspondeTipo && correspondeStatus && correspondePreco;
    });
  }, [filtros, imoveis]);

  const handleFiltroChange = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const limparFiltros = () => {
    setFiltros({
      termo: "",
      tipoImovel: "",
      status: "",
      precoMaximo: "",
    });
  };

  const filtrosAtivos = Object.values(filtros).some(Boolean);

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Imóveis</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/pagamentos")}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
          >
            <CreditCard size={18} />
            Pagamentos
          </button>
          <button
            onClick={() => navigate("/imoveis/novo")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={18} />
            Novo Imóvel
          </button>
        </div>
      </div>

      <div className="border border-gray-200 bg-white rounded-lg p-4 mb-6">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={filtros.termo}
              onChange={(e) => handleFiltroChange("termo", e.target.value)}
              placeholder="Buscar por titulo, endereco, descricao ou regras"
              className="w-full border rounded-lg pl-10 pr-4 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={filtros.tipoImovel}
              onChange={(e) => handleFiltroChange("tipoImovel", e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm text-gray-700"
            >
              <option value="">Todos os tipos</option>
              {tiposDisponiveis.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>

            <select
              value={filtros.status}
              onChange={(e) => handleFiltroChange("status", e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm text-gray-700"
            >
              <option value="">Todos os status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>

            <input
              type="number"
              min="0"
              step="0.01"
              value={filtros.precoMaximo}
              onChange={(e) => handleFiltroChange("precoMaximo", e.target.value)}
              placeholder="Preco maximo por noite"
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              {imoveisFiltrados.length} de {imoveis.length} imoveis encontrados
            </span>
            {filtrosAtivos && (
              <button
                onClick={limparFiltros}
                className="flex items-center gap-1 text-blue-600 hover:underline"
              >
                <X size={14} />
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      </div>

      {imoveis.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">Nenhum imóvel cadastrado.</p>
      ) : imoveisFiltrados.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          Nenhum imóvel encontrado para os filtros informados.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {imoveisFiltrados.map((imovel) => (
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
