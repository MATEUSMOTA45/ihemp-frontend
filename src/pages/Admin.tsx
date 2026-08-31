import { useEffect, useState } from "react";

import LojaAdmin from "../components/admin/LojaAdmin";
import PedidoAdmin from "../components/admin/PedidoAdmin";
import ProdutoAdmin from "../components/admin/ProdutoAdmin";

const API_URL = import.meta.env.VITE_API_URL;

type Usuario = {
  _id: string;
  nome: string;
  email: string;
  tipo: string;
  ativo: boolean;
};

type AbaAdmin = "usuarios" | "produtos" | "lojas" | "pedidos";

function Admin() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [abaAtiva, setAbaAtiva] = useState<AbaAdmin>("usuarios");

  async function carregarUsuarios() {
    const token = localStorage.getItem("token");

    if (!token) {
      setErro("Token não encontrado.");
      setCarregando(false);
      return;
    }

    try {
      const resposta = await fetch(
        `${API_URL}/api/usuarios`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(
          dados.mensagem || "Erro ao carregar usuários."
        );
        return;
      }

      setUsuarios(dados);
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  async function promoverParaAdmin(id: string) {
    const token = localStorage.getItem("token");

    if (!token) {
      setMensagem("Token não encontrado.");
      return;
    }

    const confirmar = window.confirm(
      "Deseja realmente promover este usuário para administrador?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(
        `${API_URL}/api/usuarios/${id}/admin`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem || "Erro ao promover usuário."
        );
        return;
      }

      setMensagem(
        "Usuário promovido para administrador!"
      );

      await carregarUsuarios();
    } catch {
      setMensagem(
        "Não foi possível conectar ao servidor."
      );
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  if (carregando) {
    return (
      <main>
        <h1>Área Administrativa</h1>
        <p>Carregando dados...</p>
      </main>
    );
  }

  if (erro) {
    return (
      <main>
        <h1>Área Administrativa</h1>
        <p>{erro}</p>
      </main>
    );
  }

  return (
    <main className="admin-container">
      <h1>Área Administrativa</h1>

      {mensagem && <p>{mensagem}</p>}

      <div className="admin-tabs">
        <button
          className={
            abaAtiva === "usuarios" ? "ativo" : ""
          }
          onClick={() => setAbaAtiva("usuarios")}
        >
          Usuários
        </button>

        <button
          className={
            abaAtiva === "produtos" ? "ativo" : ""
          }
          onClick={() => setAbaAtiva("produtos")}
        >
          Produtos
        </button>

        <button
          className={
            abaAtiva === "lojas" ? "ativo" : ""
          }
          onClick={() => setAbaAtiva("lojas")}
        >
          Lojas
        </button>

        <button
          className={
            abaAtiva === "pedidos" ? "ativo" : ""
          }
          onClick={() => setAbaAtiva("pedidos")}
        >
          Pedidos
        </button>
      </div>

      {abaAtiva === "usuarios" && (
        <section>
          <h2>Usuários cadastrados</h2>

          {usuarios.map((usuario) => (
            <div
              key={usuario._id}
              className="admin-card"
            >
              <p>
                <strong>Nome:</strong>{" "}
                {usuario.nome}
              </p>

              <p>
                <strong>E-mail:</strong>{" "}
                {usuario.email}
              </p>

              <p>
                <strong>Tipo:</strong>{" "}
                {usuario.tipo}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {usuario.ativo ? "Ativo" : "Inativo"}
              </p>

              {usuario.tipo !== "admin" && (
                <button
                  className="admin-button"
                  onClick={() =>
                    promoverParaAdmin(usuario._id)
                  }
                >
                  Tornar administrador
                </button>
              )}
            </div>
          ))}
        </section>
      )}

      {abaAtiva === "produtos" && (
        <ProdutoAdmin />
      )}

      {abaAtiva === "lojas" && (
        <LojaAdmin />
      )}

      {abaAtiva === "pedidos" && (
        <PedidoAdmin />
      )}
    </main>
  );
}

export default Admin;