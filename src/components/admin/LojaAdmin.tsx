import { useEffect, useState } from "react";
import type { FormEvent } from "react";

const API_URL = import.meta.env.VITE_API_URL;

// Tipo de loja
type Loja = {
  _id: string;
  nome: string;
  descricao: string;
  endereco: string;
  telefone: string;
  ativa: boolean;
};

function LojaAdmin() {
  // Lista de lojas
  const [lojas, setLojas] = useState<Loja[]>([]);

  // Campos do formulário
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");

  // Controle da tela
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(true);

  // Guarda a loja em edição
  const [lojaEditando, setLojaEditando] = useState<string | null>(null);

  // Busca todas as lojas
  async function carregarLojas() {
    try {
      const resposta = await fetch(
        `${API_URL}/api/lojas`
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem("Erro ao carregar lojas.");
        return;
      }

      setLojas(dados);
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  // Cria ou atualiza uma loja
  async function salvarLoja(evento: FormEvent) {
    evento.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMensagem("Token não encontrado.");
      return;
    }

    const url = lojaEditando
      ? `${API_URL}/api/lojas/${lojaEditando}`
      : `${API_URL}/api/lojas`;

    const metodo = lojaEditando ? "PUT" : "POST";

    try {
      const resposta = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome,
          descricao,
          endereco,
          telefone,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem ||
            (lojaEditando
              ? "Erro ao atualizar loja."
              : "Erro ao criar loja.")
        );
        return;
      }

      setMensagem(
        lojaEditando
          ? "Loja atualizada com sucesso!"
          : "Loja criada com sucesso!"
      );

      await carregarLojas();

      limparFormulario();
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    }
  }

  // Preenche formulário para edição
  function editarLoja(loja: Loja) {
    setLojaEditando(loja._id);

    setNome(loja.nome);
    setDescricao(loja.descricao);
    setEndereco(loja.endereco);
    setTelefone(loja.telefone);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Limpa os campos
  function limparFormulario() {
    setNome("");
    setDescricao("");
    setEndereco("");
    setTelefone("");
    setLojaEditando(null);
  }

  // Cancela a edição
  function cancelarEdicao() {
    limparFormulario();
    setMensagem("Edição cancelada.");
  }

  // Exclui loja pelo ID
  async function excluirLoja(id: string) {
    const token = localStorage.getItem("token");

    if (!token) {
      setMensagem("Token não encontrado.");
      return;
    }

    const confirmar = window.confirm(
      "Tem certeza que deseja excluir esta loja?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(
        `${API_URL}/api/lojas/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem || "Erro ao excluir loja."
        );
        return;
      }

      setLojas((lojasAtuais) =>
        lojasAtuais.filter(
          (loja) => loja._id !== id
        )
      );

      setMensagem("Loja excluída com sucesso!");
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    }
  }

  // Carrega as lojas ao abrir
  useEffect(() => {
    carregarLojas();
  }, []);

  if (carregando) {
    return <p>Carregando lojas...</p>;
  }

  return (
    <section>
      <h2>
        {lojaEditando ? "Editar loja" : "Criar loja"}
      </h2>

      {mensagem && <p>{mensagem}</p>}

      <form onSubmit={salvarLoja}>
        <div>
          <label>Nome</label>
          <br />

          <input
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
          <label>Descrição</label>
          <br />

          <input
            type="text"
            value={descricao}
            onChange={(evento) =>
              setDescricao(evento.target.value)
            }
            required
          />
        </div>

        <br />

        <div>
          <label>Endereço</label>
          <br />

          <input
            type="text"
            value={endereco}
            onChange={(evento) =>
              setEndereco(evento.target.value)
            }
            required
          />
        </div>

        <br />

        <div>
          <label>Telefone</label>
          <br />

          <input
            type="text"
            value={telefone}
            onChange={(evento) =>
              setTelefone(evento.target.value)
            }
            required
          />
        </div>

        <br />

        <button
          type="submit"
          className="admin-button"
        >
          {lojaEditando
            ? "Salvar alterações"
            : "Criar loja"}
        </button>

        {lojaEditando && (
          <button
            type="button"
            className="admin-button"
            onClick={cancelarEdicao}
          >
            Cancelar edição
          </button>
        )}
      </form>

      <hr />

      <h2>Lojas cadastradas</h2>

      {lojas.map((loja) => (
        <div
          key={loja._id}
          className="admin-card"
        >
          <h3>{loja.nome}</h3>

          <p>
            <strong>Descrição:</strong> {loja.descricao}
          </p>

          <p>
            <strong>Endereço:</strong> {loja.endereco}
          </p>

          <p>
            <strong>Telefone:</strong> {loja.telefone}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {loja.ativa ? "Ativa" : "Inativa"}
          </p>

          <button
            className="admin-button"
            onClick={() => editarLoja(loja)}
          >
            Editar
          </button>

          <button
            className="admin-button danger"
            onClick={() =>
              excluirLoja(loja._id)
            }
          >
            Excluir loja
          </button>
        </div>
      ))}
    </section>
  );
}

export default LojaAdmin;