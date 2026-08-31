import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  async function cadastrarUsuario(evento: FormEvent) {
    evento.preventDefault();

    setCarregando(true);
    setMensagem("");

    try {
      const resposta = await fetch(
        `${API_URL}/api/usuarios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome,
            email,
            senha,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem || "Erro ao criar usuário."
        );
        return;
      }

      navigate("/login");
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main>
      <h1>Cadastro</h1>

      <form onSubmit={cadastrarUsuario}>
        <div>
          <label htmlFor="nome">Nome</label>
          <br />

          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(evento) =>
              setNome(evento.target.value)
            }
            required
          />
        </div>

        <br />

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
            minLength={6}
            required
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={carregando}
        >
          {carregando
            ? "Criando conta..."
            : "Criar conta"}
        </button>
      </form>

      {mensagem && <p>{mensagem}</p>}
    </main>
  );
}

export default Cadastro;