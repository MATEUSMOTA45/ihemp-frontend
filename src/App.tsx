import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import RotaProtegida from "./components/RotaProtegida";
import RotaAdmin from "./components/RotaAdmin";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Produtos from "./pages/Produtos";
import Perfil from "./pages/Perfil";
import Admin from "./pages/Admin";
import Carrinho from "./pages/Carrinho";
import MeusPedidos from "./pages/MeusPedidos";
import Loja from "./pages/Loja";
import Produto from "./pages/Produto";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <RotaAdmin>
              <Admin />
            </RotaAdmin>
          }
        />

        <Route
          path="/perfil"
          element={
            <RotaProtegida>
              <Perfil />
            </RotaProtegida>
          }
        />

        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/lojas/:lojaId" element={<Loja />} />
        <Route path="/produtos/:produtoId" element={<Produto />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route
              path="/checkout"
              element={
        <RotaProtegida>
          <Checkout />
        </RotaProtegida>
      }
    />
        <Route 
        path="/meus-pedidos" 
        element={ 
        <RotaProtegida>
        <MeusPedidos />
        </RotaProtegida>
    }
  />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 