import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function fazerLogin(evento: FormEvent) {
    evento.preventDefault();

    setCarregando(true);
    setMensagem("");

    try {
      const resposta = await fetch(
        `${API_URL}/api/usuarios/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            senha,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem || "E-mail ou senha inválidos."
        );
        return;
      }

      login(dados.token);

      navigate("/perfil");
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={fazerLogin}>
        <div>
          <label htmlFor="email">E-mail</label>
          <br />

          <input
            id="email"
            type="email"
            value={email}
            onChange={(evento) =>
              setEmail(evento.target.value)
            }
            required
          />
        </div>

        <br />

        <div>
          <label htmlFor="senha">Senha</label>
          <br />

          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(evento) =>
              setSenha(evento.target.value)
            }
            required
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={carregando}
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </main>
  );
}

export default Login;