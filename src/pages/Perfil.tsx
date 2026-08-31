import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type Usuario = {
  _id: string;
  nome: string;
  email: string;
  tipo: string;
  ativo: boolean;
};

function Perfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mensagem, setMensagem] = useState("Carregando perfil...");

  useEffect(() => {
    async function carregarPerfil() {
      const token = localStorage.getItem("token");

      if (!token) {
        setMensagem("Você precisa fazer login.");
        return;
      }

      try {
        const resposta = await fetch(
          `${API_URL}/api/usuarios/perfil/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          setMensagem(
            dados.mensagem || "Erro ao carregar perfil."
          );
          return;
        }

        setUsuario(dados);
        setMensagem("");
      } catch {
        setMensagem("Não foi possível conectar ao servidor.");
      }
    }

    carregarPerfil();
  }, []);

  if (mensagem) {
    return (
      <main>
        <h1>Meu Perfil</h1>
        <p>{mensagem}</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Meu Perfil</h1>

      {usuario && (
        <>
          <p>
            <strong>Nome:</strong> {usuario.nome}
          </p>

          <p>
            <strong>E-mail:</strong> {usuario.email}
          </p>

          <p>
            <strong>Tipo:</strong> {usuario.tipo}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {usuario.ativo ? "Ativo" : "Inativo"}
          </p>
        </>
      )}
    </main>
  );
}

export default Perfil;