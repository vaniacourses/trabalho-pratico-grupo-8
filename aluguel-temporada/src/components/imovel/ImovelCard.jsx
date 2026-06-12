import { Pencil, Trash2 } from "lucide-react";
import COMODIDADES from "../../utils/comodidades";

function ImovelCard({ imovel, onEditar, onExcluir }) {
  const fotoPrincipal = imovel.fotos?.sort((a, b) => a.ordem - b.ordem)[0];

  const comodidadesDoImovel = COMODIDADES.filter((c) =>
    imovel.comodidades?.includes(c.id)
  );

  return (
    <div className="bg-white rounded-xl shadow flex flex-col">
      {fotoPrincipal ? (
        <img
          src={fotoPrincipal.url}
          alt={imovel.titulo}
          className="w-full h-48 object-cover rounded-t-xl"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x200?text=Sem+Imagem";
          }}
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 rounded-t-xl flex items-center justify-center text-gray-400 text-sm">
          Sem foto
        </div>
      )}

      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{imovel.titulo}</h2>
            <span className="text-xs text-gray-500">{imovel.tipoImovel}</span>
          </div>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              imovel.status === "ativo"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {imovel.status}
          </span>
        </div>

        <p className="text-sm text-gray-600">{imovel.endereco}</p>
        <p className="text-sm text-gray-500 line-clamp-2">{imovel.descricao}</p>

        {comodidadesDoImovel.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {comodidadesDoImovel.map((c) => (
              <span
                key={c.id}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {c.icone} {c.nome}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-2">
          <span className="text-base font-bold text-blue-600">
            R$ {Number(imovel.precoPorNoite).toFixed(2)}/noite
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onEditar(imovel)}
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onExcluir(imovel.id)}
              className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImovelCard;