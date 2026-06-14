import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListaImoveis from "../pages/imoveis/ListaImoveis";
import CadastrarImovel from "../pages/imoveis/CadastrarImovel";
import EditarImovel from "../pages/imoveis/EditarImovel";
import CadastrarImovelWizard from "../pages/imoveis/CadastrarImovelWizard";
import ListaDisponibilidades from "../pages/disponibilidades/ListaDisponibilidades";
import CadastrarDisponibilidade from "../pages/disponibilidades/CadastrarDisponibilidade";
import EditarDisponibilidade from "../pages/disponibilidades/EditarDisponibilidade";
import ListaUsuario from "../pages/usuarios/ListaUsuario";
import CadastrarUsuario from "../pages/usuarios/CadastrarUsuario";
import EditarUsuarios from "../pages/usuarios/EditarUsuarios";
import ListaReservas from "../pages/reservas/ListaReservas";
import CadastrarReserva from "../pages/reservas/CadastrarReserva";
import DetalheReserva from "../pages/reservas/DetalheReserva";
import ListaPoliticasCancelamento from "../pages/reservas/ListaPoliticasCancelamento";
import CadastrarPoliticaCancelamento from "../pages/reservas/CadastrarPoliticaCancelamento";
import EditarPoliticaCancelamento from "../pages/reservas/EditarPoliticaCancelamento";

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
        <Route path="/reservas" element={<ListaReservas />} />
        <Route path="/reservas/cadastrar" element={<CadastrarReserva />} />
        <Route path="/reservas/:id" element={<DetalheReserva />} />
        <Route path="/politicas-cancelamento" element={<ListaPoliticasCancelamento />} />
        <Route path="/politicas-cancelamento/cadastrar" element={<CadastrarPoliticaCancelamento />} />
        <Route path="/politicas-cancelamento/editar/:id" element={<EditarPoliticaCancelamento />} />
        <Route path="/usuarios" element={<ListaUsuario />} />
        <Route path="/usuarios/cadastrar" element={<CadastrarUsuario />} />
        <Route path="/usuarios/editar/:id" element={<EditarUsuarios />} />
      </Routes>
    </BrowserRouter>
  );
}