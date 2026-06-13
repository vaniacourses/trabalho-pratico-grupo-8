import { useState } from "react";
import { GripVertical, Trash2 } from "lucide-react";

function GerenciarFotos({ fotos, onChange }) {
  const [draggingIndex, setDraggingIndex] = useState(null);

  const handleUpload = (e) => {
    const arquivos = Array.from(e.target.files);
    arquivos.forEach((arquivo) => {
      const previewUrl = URL.createObjectURL(arquivo);
      onChange((prev) => [
        ...prev,
        {
          id: `foto-${Date.now()}-${Math.random()}`,
          url: previewUrl,
          nomeArquivo: arquivo.name,
          ordem: prev.length + 1,
        },
      ]);
    });
  };

  const handleRemover = (id) => {
    onChange((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggingIndex === null || draggingIndex === index) return;

    onChange((prev) => {
      const novaLista = [...prev];
      const [item] = novaLista.splice(draggingIndex, 1);
      novaLista.splice(index, 0, item);
      setDraggingIndex(index);
      return novaLista.map((foto, i) => ({ ...foto, ordem: i + 1 }));
    });
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
  };

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-700 mb-2">Fotos</h2>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="text-sm"
      />
      {fotos.length > 0 && (
        <p className="text-xs text-gray-400 mt-1">
          Arraste as fotos para definir a ordem de exibição.
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 mt-3">
        {fotos.map((foto, index) => (
          <div
            key={foto.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex flex-col gap-1 cursor-grab active:cursor-grabbing rounded-lg border-2 ${
              draggingIndex === index
                ? "border-blue-400 opacity-50"
                : "border-transparent"
            }`}
          >
            <div className="relative">
              <img
                src={foto.url}
                alt={`Foto ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "https://placehold.co/400x200?text=Sem+Imagem";
                }}
              />
              <div className="absolute top-1 left-1 bg-white rounded px-1 text-xs text-gray-500">
                #{index + 1}
              </div>
              <button
                type="button"
                onClick={() => handleRemover(foto.id)}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded p-1"
              >
                <Trash2 size={12} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-1 text-xs text-gray-400 bg-gray-50 rounded py-1">
              <GripVertical size={14} />
              Arrastar para reordenar
            </div>
            <span className="text-xs text-gray-500 truncate">{foto.nomeArquivo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GerenciarFotos;