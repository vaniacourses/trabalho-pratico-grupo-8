import { useState } from "react";
import { useNavigate } from "react-router-dom";
import cadastrarImovelTransacao from "../../services/cadastrarImovelTransacao";
import PassosDadosImovel from "../../components/imovel/PassosDadosImovel";
import PassosDisponibilidade from "../../components/disponibilidade/PassosDisponibilidade";
import PassosAtivarImovel from "../../components/imovel/PassosAtivarImovel";

function CadastrarImovelWizard() {
  const navigate = useNavigate();
  const [passoAtual, setPassoAtual] = useState(1);
  const [dadosImovel, setDadosImovel] = useState(null);
  const [periodos, setPeriodos] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const handleDadosImovelConcluido = (dados) => {
    setDadosImovel(dados);
    setPassoAtual(2);
  };

  const handleDisponibilidadeConcluida = (periodosColetados) => {
    setPeriodos(periodosColetados);
    setPassoAtual(3);
  };

  const finalizarCadastro = async (status) => {
    setErro("");
    setSalvando(true);

    try {
      await cadastrarImovelTransacao(dadosImovel, periodos, status);
      navigate("/imoveis");
    } catch (error) {
      setErro(error.message);
    } finally {
      setSalvando(false);
    }
  };

  const passos = [
    { numero: 1, label: "Dados do Imóvel" },
    { numero: 2, label: "Disponibilidade" },
    { numero: 3, label: "Ativar Anúncio" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Indicador de passos */}
      <div className="flex items-center justify-between mb-8">
        {passos.map((passo, index) => (
          <div key={passo.numero} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  passoAtual > passo.numero
                    ? "bg-green-500 text-white"
                    : passoAtual === passo.numero
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {passoAtual > passo.numero ? "✓" : passo.numero}
              </div>
              <span className="text-xs text-gray-500 mt-1 text-center">
                {passo.label}
              </span>
            </div>
            {index < passos.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 mb-4 rounded ${
                  passoAtual > passo.numero ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Conteúdo do passo atual */}
      {passoAtual === 1 && (
        <PassosDadosImovel onConcluir={handleDadosImovelConcluido} />
      )}
      {passoAtual === 2 && (
        <PassosDisponibilidade
          onConcluir={handleDisponibilidadeConcluida}
          onPular={() => setPassoAtual(3)}
        />
      )}
      {passoAtual === 3 && (
        <PassosAtivarImovel
          imovel={dadosImovel}
          disponibilidades={periodos}
          erro={erro}
          salvando={salvando}
          onAtivar={() => finalizarCadastro("ativo")}
          onManterInativo={() => finalizarCadastro("inativo")}
        />
      )}
    </div>
  );
}

export default CadastrarImovelWizard;