import { Pencil, Trash2 } from "lucide-react";

function FotoCard({ foto, onEditar, onExcluir }) {
  return (
    <div className="bg-white rounded-xl shadow p-3 flex flex-col gap-2">
      <img
        src={foto.url}
        alt={`Foto ordem ${foto.ordem}`}
        className="w-full h-40 object-cover rounded-lg"
        onError={(e) => {
          e.target.src = "https://placehold.co/400x200?text=Sem+Imagem";
        }}
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">Ordem: {foto.ordem}</span>
        <div className="flex gap-2">
          <button
            onClick={() => onEditar(foto)}
            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onExcluir(foto.id)}
            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default FotoCard;