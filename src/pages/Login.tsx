import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Leaf,
  LockKeyhole,
  Mail,
  PackageCheck,
  ShieldCheck,
  Store,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Envia as credenciais para o backend e guarda o token JWT.
  async function fazerLogin(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setCarregando(true);
    setMensagem("");

    try {
      const resposta = await fetch(`${API_URL}/api/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.mensagem || "E-mail ou senha inválidos.");
        return;
      }

      login(dados.token);
      navigate("/perfil");
    } catch {
      setMensagem("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="auth-page">
      <Container className="auth-page__container">
        <section className="auth-showcase" aria-label="Benefícios do IHEMP">
          <div className="auth-showcase__content">
            <span className="auth-showcase__eyebrow">
              <Leaf size={16} aria-hidden="true" />
              Sua natureza, seu bem-estar
            </span>

            <h1>Que bom ter você de volta.</h1>
            <p>
              Entre para acompanhar seus pedidos e continuar descobrindo lojas
              e produtos selecionados perto de você.
            </p>

            <ul className="auth-benefits">
              <li>
                <span><Store size={19} aria-hidden="true" /></span>
                <div>
                  <strong>Lojas verificadas</strong>
                  <small>Parceiros selecionados com cuidado.</small>
                </div>
              </li>
              <li>
                <span><PackageCheck size={19} aria-hidden="true" /></span>
                <div>
                  <strong>Acompanhe seus pedidos</strong>
                  <small>Consulte o histórico em um só lugar.</small>
                </div>
              </li>
              <li>
                <span><ShieldCheck size={19} aria-hidden="true" /></span>
                <div>
                  <strong>Acesso protegido</strong>
                  <small>Seus dados e sua conta ficam seguros.</small>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="auth-panel" aria-labelledby="login-title">
          <div className="auth-panel__heading">
            <span>Bem-vindo</span>
            <h2 id="login-title">Entrar na sua conta</h2>
            <p>Use seu e-mail e sua senha para continuar.</p>
          </div>

          <form className="auth-form" onSubmit={fazerLogin}>
            <div className="auth-field">
              <label htmlFor="email">E-mail</label>
              <div className="auth-field__control">
                <Mail size={19} aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  placeholder="seuemail@exemplo.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="senha">Senha</label>
              <div className="auth-field__control">
                <LockKeyhole size={19} aria-hidden="true" />
                <input
                  id="senha"
                  type={senhaVisivel ? "text" : "password"}
                  value={senha}
                  onChange={(evento) => setSenha(evento.target.value)}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                />
                <button
                  className="auth-field__password-toggle"
                  type="button"
                  onClick={() => setSenhaVisivel((visivel) => !visivel)}
                  aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
                >
                  {senhaVisivel ? (
                    <EyeOff size={19} aria-hidden="true" />
                  ) : (
                    <Eye size={19} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {mensagem && (
              <p className="auth-form__notice" role="alert">
                {mensagem}
              </p>
            )}

            <Button
              className="auth-form__submit"
              type="submit"
              size="large"
              fullWidth
              loading={carregando}
            >
              {carregando ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="auth-panel__signup">
            Ainda não tem uma conta? <Link to="/cadastro">Criar conta</Link>
          </p>

          <Link className="auth-panel__back" to="/">
            Continuar explorando
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </section>
      </Container>
    </main>
  );
}

export default Login;
