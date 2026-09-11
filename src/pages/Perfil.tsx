import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  LayoutDashboard,
  LogOut,
  Mail,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Container from "../components/ui/Container";
import { useAuth } from "../context/AuthContext";
import "../styles/perfil.css";
import { fetchComTentativas } from "../utils/fetchComTentativas";

const API_URL = import.meta.env.VITE_API_URL;

type Usuario = {
  _id: string;
  nome: string;
  email: string;
  tipo: string;
  ativo: boolean;
};

function Perfil() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Busca os dados atuais da conta e a quantidade de pedidos.
  const carregarPerfil = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErro("Você precisa fazer login para acessar seu perfil.");
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetchComTentativas(
        `${API_URL}/api/usuarios/perfil/me`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.mensagem || "Não foi possível carregar seu perfil.");
        return;
      }

      setUsuario(dados);

      // A contagem é complementar: o perfil continua funcionando se ela falhar.
      try {
        const respostaPedidos = await fetchComTentativas(
          `${API_URL}/api/pedidos/meus`,
          {
            headers: { Authorization: `Bearer ${token}` },
            tentativas: 2,
          },
        );

        if (respostaPedidos.ok) {
          const pedidos = await respostaPedidos.json();
          setTotalPedidos(Array.isArray(pedidos) ? pedidos.length : 0);
        }
      } catch {
        setTotalPedidos(0);
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) {
        setErro("Não foi possível conectar ao servidor.");
      }
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    carregarPerfil();
  }, [carregarPerfil]);

  const iniciais = useMemo(() => {
    if (!usuario?.nome) return "IH";

    return usuario.nome
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((parte) => parte.charAt(0).toUpperCase())
      .join("");
  }, [usuario?.nome]);

  function sairDaConta() {
    logout();
    navigate("/login");
  }

  return (
    <main className="ihemp-profile-page">
      <Container>
        <header className="profile-heading">
          <div>
            <span>Minha conta</span>
            <h1>Meu perfil</h1>
            <p>Consulte seus dados e acesse rapidamente suas atividades.</p>
          </div>

          {!carregando && usuario && (
            <button type="button" onClick={carregarPerfil}>
              <RefreshCw size={17} aria-hidden="true" />
              Atualizar
            </button>
          )}
        </header>

        {carregando ? (
          <div className="profile-loading" aria-live="polite">
            <span />
            <div>
              <span />
              <span />
            </div>
            <p>Carregando seu perfil...</p>
          </div>
        ) : erro ? (
          <Card className="profile-state" variant="soft" padding="large">
            <AlertCircle size={38} aria-hidden="true" />
            <h2>Não foi possível carregar</h2>
            <p>{erro}</p>
            <Button onClick={carregarPerfil}>Tentar novamente</Button>
          </Card>
        ) : usuario ? (
          <>
            <section className="profile-cover" aria-label="Resumo do perfil">
              <div className="profile-cover__identity">
                <span className="profile-avatar" aria-hidden="true">
                  {iniciais}
                </span>

                <div>
                  <span className="profile-cover__eyebrow">Bem-vindo de volta</span>
                  <h2>{usuario.nome}</h2>
                  <p>
                    <Mail size={16} aria-hidden="true" />
                    {usuario.email}
                  </p>
                </div>
              </div>

              <span className="profile-cover__status">
                <CheckCircle2 size={17} aria-hidden="true" />
                {usuario.ativo ? "Conta ativa" : "Conta inativa"}
              </span>
            </section>

            <section className="profile-stats" aria-label="Resumo da conta">
              <Card variant="outlined" padding="small">
                <PackageCheck size={22} aria-hidden="true" />
                <div>
                  <strong>{totalPedidos}</strong>
                  <span>{totalPedidos === 1 ? "Pedido realizado" : "Pedidos realizados"}</span>
                </div>
              </Card>

              <Card variant="outlined" padding="small">
                <ShieldCheck size={22} aria-hidden="true" />
                <div>
                  <strong>{usuario.ativo ? "Ativa" : "Inativa"}</strong>
                  <span>Situação da conta</span>
                </div>
              </Card>

              <Card variant="outlined" padding="small">
                <UserRound size={22} aria-hidden="true" />
                <div>
                  <strong>{usuario.tipo === "admin" ? "Administrador" : "Cliente"}</strong>
                  <span>Tipo de acesso</span>
                </div>
              </Card>
            </section>

            <div className="profile-layout">
              <Card className="profile-details" variant="outlined" padding="large">
                <div className="profile-card-heading">
                  <span><UserRound size={20} aria-hidden="true" /></span>
                  <div>
                    <h2>Dados pessoais</h2>
                    <p>Informações usadas na sua conta IHEMP.</p>
                  </div>
                </div>

                <dl>
                  <div><dt>Nome completo</dt><dd>{usuario.nome}</dd></div>
                  <div><dt>E-mail</dt><dd>{usuario.email}</dd></div>
                  <div>
                    <dt>Perfil</dt>
                    <dd>{usuario.tipo === "admin" ? "Administrador" : "Cliente"}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd className={usuario.ativo ? "is-active" : "is-inactive"}>
                      {usuario.ativo ? "Ativo" : "Inativo"}
                    </dd>
                  </div>
                </dl>
              </Card>

              <Card className="profile-shortcuts" variant="outlined" padding="large">
                <div className="profile-card-heading">
                  <span><LayoutDashboard size={20} aria-hidden="true" /></span>
                  <div>
                    <h2>Acessos rápidos</h2>
                    <p>Continue de onde parou.</p>
                  </div>
                </div>

                <nav aria-label="Acessos da conta">
                  <Link to="/meus-pedidos">
                    <span><PackageCheck size={20} aria-hidden="true" /></span>
                    <div>
                      <strong>Meus pedidos</strong>
                      <small>Acompanhe seu histórico de compras</small>
                    </div>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>

                  <Link to="/produtos">
                    <span><ShoppingBag size={20} aria-hidden="true" /></span>
                    <div>
                      <strong>Explorar produtos</strong>
                      <small>Conheça as opções disponíveis</small>
                    </div>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>

                  {usuario.tipo === "admin" && (
                    <Link to="/admin">
                      <span><LayoutDashboard size={20} aria-hidden="true" /></span>
                      <div>
                        <strong>Área administrativa</strong>
                        <small>Gerencie o marketplace IHEMP</small>
                      </div>
                      <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                  )}
                </nav>

                <button className="profile-logout" type="button" onClick={sairDaConta}>
                  <LogOut size={19} aria-hidden="true" />
                  Sair da conta
                </button>
              </Card>
            </div>
          </>
        ) : null}
      </Container>
    </main>
  );
}

export default Perfil;