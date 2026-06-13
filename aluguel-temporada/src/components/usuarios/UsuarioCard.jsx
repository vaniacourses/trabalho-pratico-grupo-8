import { useNavigate } from "react-router-dom";
import { User, Phone, Mail, Tag, Circle } from "lucide-react";

function UsuarioCard({ usuario, onExcluir }) {
  const navigate = useNavigate();

  const tipoLabel = {
    hospede: "Hóspede",
    anfitriao: "Anfitrião",
    administrador: "Administrador",
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User size={18} className="text-blue-600" />
          <span className="font-semibold text-gray-800">{usuario.nome}</span>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            usuario.status === "ativo"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {usuario.status === "ativo" ? "Ativo" : "Inativo"}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Mail size={14} />
        <span>{usuario.email}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Phone size={14} />
        <span>{usuario.telefone}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Tag size={14} />
        <span>{tipoLabel[usuario.tipo] ?? usuario.tipo}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Circle size={14} />
        <span>Cadastrado em: {new Date(usuario.dataCadastro).toLocaleDateString("pt-BR")}</span>
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => navigate(`/usuarios/editar/${usuario.id}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm"
        >
          Editar
        </button>
        <button
          onClick={() => onExcluir(usuario.id)}
          className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-1.5 rounded-lg text-sm"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

export default UsuarioCard;