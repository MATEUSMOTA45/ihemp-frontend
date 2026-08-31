import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();

  const { estaLogado, usuario, logout } = useAuth();

  function sair() {
    logout();
    navigate("/login");
  }

  return (
    <nav>
      <Link to="/">Início</Link>
      <Link to="/produtos">Produtos</Link>
      <Link to="/carrinho">Carrinho</Link>

      {estaLogado ? (
        <>
          <span>Olá, {usuario?.nome || "usuário"}</span>

          <Link to="/perfil">Meu Perfil</Link>

          {/* Mostra os pedidos do usuário logado */}
          <Link to="/meus-pedidos">
            Meus Pedidos
          </Link>

          {/* Só aparece para admin */}
          {usuario?.tipo === "admin" && (
            <Link to="/admin">Admin</Link>
          )}

          <button onClick={sair}>Sair</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/cadastro">Cadastro</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;