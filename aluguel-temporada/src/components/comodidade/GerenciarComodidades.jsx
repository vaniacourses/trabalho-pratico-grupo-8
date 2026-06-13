import COMODIDADES from "../../utils/comodidades";

function GerenciarComodidades({ selecionadas, onChange }) {
  const handleToggle = (id) => {
    onChange((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-700 mb-2">Comodidades</h2>
      <div className="grid grid-cols-2 gap-2">
        {COMODIDADES.map((c) => (
          <label
            key={c.id}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selecionadas.includes(c.id)}
              onChange={() => handleToggle(c.id)}
            />
            <span>{c.icone} {c.nome}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default GerenciarComodidades;