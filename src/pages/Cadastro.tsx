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
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/ui/Button";
import Container from "../components/ui/Container";
import "../styles/login.css";

const API_URL = import.meta.env.VITE_API_URL;

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  // Envia os dados do novo usuário para o backend.
  async function cadastrarUsuario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setCarregando(true);
    setMensagem("");

    try {
      const resposta = await fetch(`${API_URL}/api/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.mensagem || "Não foi possível criar sua conta.");
        return;
      }

      navigate("/login", { replace: true });
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
              Faça parte do IHEMP
            </span>

            <h1>Seu bem-estar começa por aqui.</h1>
            <p>
              Crie sua conta para descobrir lojas, organizar seus pedidos e ter
              uma experiência feita para você.
            </p>

            <ul className="auth-benefits">
              <li>
                <span><Store size={19} aria-hidden="true" /></span>
                <div>
                  <strong>Descubra novas lojas</strong>
                  <small>Encontre parceiros e produtos selecionados.</small>
                </div>
              </li>
              <li>
                <span><PackageCheck size={19} aria-hidden="true" /></span>
                <div>
                  <strong>Pedidos organizados</strong>
                  <small>Acompanhe tudo pela sua conta.</small>
                </div>
              </li>
              <li>
                <span><ShieldCheck size={19} aria-hidden="true" /></span>
                <div>
                  <strong>Cadastro protegido</strong>
                  <small>Seus dados ficam seguros no IHEMP.</small>
                </div>
              </li>
            </ul>
          </div>
        </section>

        <section className="auth-panel" aria-labelledby="cadastro-title">
          <div className="auth-panel__heading">
            <span>Comece agora</span>
            <h2 id="cadastro-title">Criar sua conta</h2>
            <p>Preencha seus dados para entrar no IHEMP.</p>
          </div>

          <form className="auth-form" onSubmit={cadastrarUsuario}>
            <div className="auth-field">
              <label htmlFor="nome">Nome</label>
              <div className="auth-field__control">
                <UserRound size={19} aria-hidden="true" />
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value)}
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

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
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
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
              <small className="auth-field__hint">Use pelo menos 8 e 72 caracteres.</small>
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
              {carregando ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>

          <p className="auth-panel__signup">
            Já tem uma conta? <Link to="/login">Entrar</Link>
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

export default Cadastro;
