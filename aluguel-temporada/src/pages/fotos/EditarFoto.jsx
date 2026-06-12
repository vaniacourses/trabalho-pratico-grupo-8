import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import fotoService from "../../services/fotoService";

function EditarFoto() {
  const { idImovel, id } = useParams();
  const navigate = useNavigate();
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    url: "",
    ordem: "",
  });

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await fotoService.buscarPorId(id);
        setForm(data);
      } catch (error) {
        console.error("Erro ao carregar foto:", error);
      }
    };

    carregar();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      if (!form.url) throw new Error("URL da foto é obrigatória.");
      if (!form.ordem) throw new Error("Ordem é obrigatória.");

      await fotoService.atualizar(id, {
        ...form,
        idImovel: Number(idImovel),
        ordem: Number(form.ordem),
      });

      navigate(`/imoveis/${idImovel}/fotos`);
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Foto</h1>

      {erro && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="url"
          placeholder="URL da foto"
          value={form.url}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        />
        <input
          name="ordem"
          placeholder="Ordem de exibição"
          type="number"
          value={form.ordem}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 text-sm"
        />

        {form.url && (
          <img
            src={form.url}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = "https://placehold.co/400x200?text=URL+Inválida";
            }}
          />
        )}

        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={() => navigate(`/imoveis/${idImovel}/fotos`)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarFoto;