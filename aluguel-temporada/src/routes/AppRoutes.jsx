import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListaImoveis from "../pages/imoveis/ListaImoveis";
import CadastrarImovel from "../pages/imoveis/CadastrarImovel";
import EditarImovel from "../pages/imoveis/EditarImovel";
import CadastrarImovelWizard from "../pages/imoveis/CadastrarImovelWizard";
import ListaDisponibilidades from "../pages/disponibilidades/ListaDisponibilidades";
import CadastrarDisponibilidade from "../pages/disponibilidades/CadastrarDisponibilidade";
import EditarDisponibilidade from "../pages/disponibilidades/EditarDisponibilidade";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListaImoveis />} />
        <Route path="/imoveis" element={<ListaImoveis />} />
        <Route path="/imoveis/novo" element={<CadastrarImovelWizard />} />
        <Route path="/imoveis/cadastrar" element={<CadastrarImovel />} />
        <Route path="/imoveis/editar/:id" element={<EditarImovel />} />
        <Route path="/imoveis/:idImovel/disponibilidades" element={<ListaDisponibilidades />} />
        <Route path="/imoveis/:idImovel/disponibilidades/cadastrar" element={<CadastrarDisponibilidade />} />
        <Route path="/imoveis/:idImovel/disponibilidades/editar/:id" element={<EditarDisponibilidade />} />
      </Routes>
    </BrowserRouter>
  );
}