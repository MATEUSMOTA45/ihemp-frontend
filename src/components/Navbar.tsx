import { useState } from "react";
import type { FormEvent } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCarrinho } from "../context/CarrinhoContext";

import Container from "./ui/Container";
import Icon from "./ui/Icon";
import SearchInput from "./ui/SearchInput";

import ihempMark from "../assets/ihemp-mark.svg";

function Navbar() {
  const navigate = useNavigate();

  const { estaLogado, usuario, logout } = useAuth();
  const { itens } = useCarrinho();

  const [busca, setBusca] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);

  // Soma a quantidade de todos os produtos.
  const quantidadeCarrinho = itens.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  // Mostra apenas o primeiro nome.
  const primeiroNome =
    usuario?.nome?.split(" ")[0] || "Perfil";

  // Envia o usuário para a página de produtos.
  function pesquisar(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    const termo = busca.trim();

    const destino = termo
      ? `/produtos?busca=${encodeURIComponent(termo)}`
      : "/produtos";

    navigate(destino);
    setMenuAberto(false);
  }

  // Desconecta o usuário.
  function sair() {
    logout();
    setMenuAberto(false);
    navigate("/login");
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <header className="ihemp-header">
      <Container className="ihemp-header__container">
        <div className="ihemp-header__topbar">
          {/* Marca do IHEMP */}
          <Link
            className="ihemp-logo"
            to="/"
            onClick={fecharMenu}
          >
            <img
              className="ihemp-logo__mark"
              src={ihempMark}
              alt=""
              aria-hidden="true"
            />

            <span className="ihemp-logo__content">
              <strong>IHEMP</strong>

              <small>
                Sua natureza, seu bem-estar
              </small>
            </span>
          </Link>

          {/* Localização */}
          <div className="ihemp-header__location">
            <Icon name="location" size={20} />

            <span>Cascavel, PR</span>

            <Icon
              name="chevron-down"
              size={16}
            />
          </div>

          {/* Busca para computadores */}
          <form
            className="
              ihemp-header__search
              ihemp-header__search--desktop
            "
            role="search"
            onSubmit={pesquisar}
          >
            <SearchInput
              value={busca}
              onChange={(evento) =>
                setBusca(evento.target.value)
              }
              placeholder="Buscar produtos, lojas ou marcas..."
              aria-label="Buscar produtos, lojas ou marcas"
            />

            <button
              className="ihemp-header__search-button"
              type="submit"
              aria-label="Pesquisar"
            >
              <Icon name="search" size={20} />
            </button>
          </form>

          {/* Ações para computadores */}
          <nav
            className="ihemp-header__actions"
            aria-label="Ações principais"
          >
            <Link
              className="ihemp-header__action"
              to="/produtos"
            >
              <Icon name="store" size={23} />
              <span>Produtos</span>
            </Link>

            {estaLogado ? (
              <details className="ihemp-header__profile-menu">
                <summary className="ihemp-header__action">
                  <Icon name="user" size={23} />
                  <span>{primeiroNome}</span>
                </summary>

                <div className="ihemp-header__dropdown">
                  <Link to="/perfil">
                    Meu perfil
                  </Link>

                  <Link to="/meus-pedidos">
                    Meus pedidos
                  </Link>

                  {usuario?.tipo === "admin" && (
                    <Link to="/admin">
                      Administração
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={sair}
                  >
                    <Icon
                      name="logout"
                      size={18}
                    />

                    Sair
                  </button>
                </div>
              </details>
            ) : (
              <Link
                className="ihemp-header__action"
                to="/login"
              >
                <Icon name="user" size={23} />
                <span>Entrar</span>
              </Link>
            )}

            <Link
              className="
                ihemp-header__action
                ihemp-header__cart
              "
              to="/carrinho"
            >
              <span className="ihemp-header__cart-icon">
                <Icon name="cart" size={25} />

                {quantidadeCarrinho > 0 && (
                  <span className="ihemp-header__cart-count">
                    {quantidadeCarrinho > 99
                      ? "99+"
                      : quantidadeCarrinho}
                  </span>
                )}
              </span>

              <span>Carrinho</span>
            </Link>
          </nav>

          {/* Botão do menu para celulares */}
          <button
            className="ihemp-header__menu-button"
            type="button"
            onClick={() =>
              setMenuAberto((aberto) => !aberto)
            }
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
            aria-label={
              menuAberto
                ? "Fechar menu"
                : "Abrir menu"
            }
          >
            <Icon
              name={menuAberto ? "close" : "menu"}
              size={26}
            />
          </button>
        </div>

        {/* Busca para celulares */}
        <form
          className="
            ihemp-header__search
            ihemp-header__search--mobile
          "
          role="search"
          onSubmit={pesquisar}
        >
          <SearchInput
            value={busca}
            onChange={(evento) =>
              setBusca(evento.target.value)
            }
            placeholder="Buscar produtos ou lojas..."
            aria-label="Buscar produtos ou lojas"
          />
        </form>

        {/* Menu para celulares */}
        {menuAberto && (
          <nav
            className="ihemp-header__mobile-menu"
            id="menu-mobile"
            aria-label="Menu principal"
          >
            <NavLink
              to="/"
              onClick={fecharMenu}
            >
              <Icon name="home" size={20} />
              Início
            </NavLink>

            <NavLink
              to="/produtos"
              onClick={fecharMenu}
            >
              <Icon name="store" size={20} />
              Produtos
            </NavLink>

            <NavLink
              to="/carrinho"
              onClick={fecharMenu}
            >
              <Icon name="cart" size={20} />
              Carrinho ({quantidadeCarrinho})
            </NavLink>

            {estaLogado ? (
              <>
                <NavLink
                  to="/perfil"
                  onClick={fecharMenu}
                >
                  <Icon name="user" size={20} />
                  Meu perfil
                </NavLink>

                <NavLink
                  to="/meus-pedidos"
                  onClick={fecharMenu}
                >
                  <Icon name="orders" size={20} />
                  Meus pedidos
                </NavLink>

                {usuario?.tipo === "admin" && (
                  <NavLink
                    to="/admin"
                    onClick={fecharMenu}
                  >
                    <Icon
                      name="store"
                      size={20}
                    />

                    Administração
                  </NavLink>
                )}

                <button
                  type="button"
                  onClick={sair}
                >
                  <Icon
                    name="logout"
                    size={20}
                  />

                  Sair
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={fecharMenu}
                >
                  <Icon name="user" size={20} />
                  Entrar
                </NavLink>

                <NavLink
                  to="/cadastro"
                  onClick={fecharMenu}
                >
                  Criar conta
                </NavLink>
              </>
            )}
          </nav>
        )}
      </Container>
    </header>
  );
}

export default Navbar;