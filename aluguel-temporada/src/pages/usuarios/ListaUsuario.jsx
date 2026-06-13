import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usuarioService from "../../services/usuarioService";
import UsuarioCard from "../../components/usuarios/UsuarioCard";

function ListaUsuario() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");

  const carregarUsuarios = async () => {
    try {
      const data = await usuarioService.listar();
      setUsuarios(data);
    } catch (error) {
      setErro("Erro ao carregar usuários.");
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleExcluir = async (id) => {
    if (!window.confirm("Deseja excluir este usuário?")) return;
    try {
      await usuarioService.excluir(id);
      await carregarUsuarios();
    } catch (error) {
      setErro("Erro ao excluir usuário.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Usuários</h1>
        <button
          onClick={() => navigate("/usuarios/cadastrar")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          + Novo Usuário
        </button>
      </div>

      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
          {erro}
        </div>
      )}

      {usuarios.length === 0 ? (
        <p className="text-gray-500 text-sm">Nenhum usuário cadastrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {usuarios.map((usuario) => (
            <UsuarioCard
              key={usuario.id}
              usuario={usuario}
              onExcluir={handleExcluir}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaUsuario;