import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListaImoveis from "../pages/imoveis/ListaImoveis";
import CadastrarImovel from "../pages/imoveis/CadastrarImovel";
import EditarImovel from "../pages/imoveis/EditarImovel";
import ListaFotos from "../pages/fotos/ListaFotos";
import CadastrarFoto from "../pages/fotos/CadastrarFoto";
import EditarFoto from "../pages/fotos/EditarFoto";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListaImoveis />} />
        <Route path="/imoveis" element={<ListaImoveis />} />
        <Route path="/imoveis/cadastrar" element={<CadastrarImovel />} />
        <Route path="/imoveis/editar/:id" element={<EditarImovel />} />
        <Route path="/imoveis/:idImovel/fotos" element={<ListaFotos />} />
        <Route path="/imoveis/:idImovel/fotos/cadastrar" element={<CadastrarFoto />} />
        <Route path="/imoveis/:idImovel/fotos/editar/:id" element={<EditarFoto />} />
      </Routes>
    </BrowserRouter>
  );
}