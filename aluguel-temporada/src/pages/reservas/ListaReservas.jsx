import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import reservaService from "../../services/reservaService";
import imovelService from "../../services/imovelService";
import usuarioService from "../../services/usuarioService";
import ReservaCard from "../../components/reservas/ReservaCard";

function ListaReservas() {
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [imoveisPorId, setImoveisPorId] = useState({});
  const [usuariosPorId, setUsuariosPorId] = useState({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregar = async () => {
      try {
        const [reservasData, imoveis, usuarios] = await Promise.all([
          reservaService.listar(),
          imovelService.listar(),
          usuarioService.listar(),
        ]);

        setReservas(reservasData);
        setImoveisPorId(Object.fromEntries(imoveis.map((i) => [i.id, i])));
        setUsuariosPorId(Object.fromEntries(usuarios.map((u) => [u.id, u])));
      } catch (error) {
        setErro(error.message || "Erro ao carregar reservas.");
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, []);

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja excluir esta reserva?")) return;
    try {
      await reservaService.excluir(id);
      setReservas((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      setErro(error.message || "Erro ao excluir reserva.");
    }
  };

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reservas</h1>
        <button
          onClick={() => navigate("/reservas/cadastrar")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} />
          Nova Reserva
        </button>
      </div>

      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
          {erro}
        </div>
      )}

      {reservas.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          Nenhuma reserva cadastrada.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservas.map((reserva) => (
            <ReservaCard
              key={reserva.id}
              reserva={reserva}
              imovelTitulo={imoveisPorId[reserva.idImovel]?.titulo}
              hospedeNome={usuariosPorId[reserva.idHospede]?.nome}
              onExcluir={handleExcluir}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaReservas;
