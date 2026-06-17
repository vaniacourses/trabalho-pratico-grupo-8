import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import avaliacaoService from "../../services/avaliacaoService";

function RelatorioImovel() {

  const { imovelId } = useParams();
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        // busca só as avaliações daquele imóvel específico
        const data = await avaliacaoService.listarPorImovel(imovelId);
        setAvaliacoes(data);
      } catch (error) {
        console.error("Erro ao carregar relatório:", error);
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, [imovelId]);

  // ── funções de cálculo ──

  const calcularMedia = () => {
    if (avaliacoes.length === 0) return 0;
    const soma = avaliacoes.reduce((acc, av) => acc + Number(av.nota), 0);
    return (soma / avaliacoes.length).toFixed(1);
  };

  const calcularMediaCategorias = () => {
    if (avaliacoes.length === 0) return {};
    const cats = ["limpeza", "localizacao", "custo", "comunicacao"];
    return cats.reduce((acc, cat) => {
      const soma = avaliacoes.reduce(
        (s, av) => s + (av.categorias?.[cat] || 0),
        0
      );
      acc[cat] = (soma / avaliacoes.length).toFixed(1);
      return acc;
    }, {});
  };

  // conta quantas avaliações tem de cada nota (1 a 5)
  const calcularDistribuicao = () => {
    const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    avaliacoes.forEach((av) => {
      if (dist[av.nota] !== undefined) dist[av.nota]++;
    });
    return dist;
  };

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  const media = calcularMedia();
  const categorias = calcularMediaCategorias();
  const distribuicao = calcularDistribuicao();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Relatório do Imóvel
      </h1>

      {avaliacoes.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          Nenhuma avaliação encontrada para este imóvel.
        </p>
      ) : (
        <>
          {/* cards de resumo */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-gray-800">{media}</p>
              <p className="text-sm text-gray-500">Nota média</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-gray-800">
                {avaliacoes.length}
              </p>
              <p className="text-sm text-gray-500">Total de avaliações</p>
            </div>
          </div>

          {/* distribuição de notas */}
          <div className="border rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Distribuição de notas
            </h2>
            {[5, 4, 3, 2, 1].map((estrela) => (
              <div key={estrela} className="flex items-center gap-3 mb-2">
                <span className="text-sm text-gray-500 w-8">
                  {estrela} ★
                </span>
                {/* barra de progresso — largura calculada em % */}
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width:
                        avaliacoes.length > 0
                          ? `${(distribuicao[estrela] / avaliacoes.length) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-6">
                  {distribuicao[estrela]}
                </span>
              </div>
            ))}
          </div>

          {/* médias por categoria */}
          <div className="border rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Notas por categoria
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(categorias).map(([cat, valor]) => (
                <div key={cat} className="flex justify-between text-sm">
                  <span className="text-gray-500 capitalize">{cat}</span>
                  <span className="font-medium text-gray-800">{valor}/5</span>
                </div>
              ))}
            </div>
          </div>

          {/* lista dos comentários */}
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Comentários
            </h2>
            <div className="flex flex-col gap-3">
              {avaliacoes.map((av) => (
                <div
                  key={av.id}
                  className="border-b pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Nota: {av.nota}/5
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(av.data).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{av.comentario}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RelatorioImovel;