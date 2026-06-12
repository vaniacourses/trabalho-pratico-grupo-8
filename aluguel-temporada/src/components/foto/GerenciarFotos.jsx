function GerenciarFotos({ fotos, onChange }) {
  const handleUpload = (e) => {
    const arquivos = Array.from(e.target.files);
    arquivos.forEach((arquivo, index) => {
      const previewUrl = URL.createObjectURL(arquivo);
      onChange((prev) => [
        ...prev,
        {
          url: previewUrl,
          nomeArquivo: arquivo.name,
          ordem: prev.length + index + 1,
        },
      ]);
    });
  };

  const handleRemover = (index) => {
    onChange((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOrdem = (index, novaOrdem) => {
    onChange((prev) =>
      prev.map((foto, i) =>
        i === index ? { ...foto, ordem: Number(novaOrdem) } : foto
      )
    );
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
      <div className="grid grid-cols-2 gap-3 mt-3">
        {fotos.map((foto, index) => (
          <div key={index} className="flex flex-col gap-1">
            <img
              src={foto.url}
              alt={`Foto ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = "https://placehold.co/400x200?text=Sem+Imagem";
              }}
            />
            <span className="text-xs text-gray-500 truncate">{foto.nomeArquivo}</span>
            <input
              type="number"
              value={foto.ordem}
              onChange={(e) => handleOrdem(index, e.target.value)}
              placeholder="Ordem"
              className="border rounded px-2 py-1 text-xs"
            />
            <button
              type="button"
              onClick={() => handleRemover(index)}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GerenciarFotos;