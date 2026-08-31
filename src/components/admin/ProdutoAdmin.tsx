import { useEffect, useState } from "react";
import type { FormEvent } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type Loja = {
  _id: string;
  nome: string;
};

type Produto = {
  _id: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria: string;
  ativo: boolean;
  loja: Loja;
};

function ProdutoAdmin() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [lojas, setLojas] = useState<Loja[]>([]);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [categoria, setCategoria] = useState("");
  const [loja, setLoja] = useState("");

  const [produtoEditando, setProdutoEditando] =
    useState<string | null>(null);

  const [mensagem, setMensagem] = useState("");

  async function carregarDados() {
    try {
      const [respostaProdutos, respostaLojas] = await Promise.all([
        fetch(`${API_URL}/api/produtos`),
        fetch(`${API_URL}/api/lojas`),
      ]);

      const dadosProdutos = await respostaProdutos.json();
      const dadosLojas = await respostaLojas.json();

      if (!respostaProdutos.ok) {
        setMensagem("Erro ao carregar produtos.");
        return;
      }

      if (!respostaLojas.ok) {
        setMensagem("Erro ao carregar lojas.");
        return;
      }

      setProdutos(dadosProdutos);
      setLojas(dadosLojas);
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    }
  }

  async function salvarProduto(evento: FormEvent) {
    evento.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMensagem("Token não encontrado.");
      return;
    }

    const url = produtoEditando
      ? `${API_URL}/api/produtos/${produtoEditando}`
      : `${API_URL}/api/produtos`;

    const metodo = produtoEditando ? "PUT" : "POST";

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
          preco: Number(preco),
          estoque: Number(estoque),
          categoria,
          loja,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem ||
            (produtoEditando
              ? "Erro ao atualizar produto."
              : "Erro ao criar produto.")
        );
        return;
      }

      setMensagem(
        produtoEditando
          ? "Produto atualizado com sucesso!"
          : "Produto criado com sucesso!"
      );

      limparFormulario();
      await carregarDados();
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    }
  }

  function editarProduto(produto: Produto) {
    setProdutoEditando(produto._id);

    setNome(produto.nome);
    setDescricao(produto.descricao);
    setPreco(String(produto.preco));
    setEstoque(String(produto.estoque));
    setCategoria(produto.categoria);
    setLoja(produto.loja._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function limparFormulario() {
    setNome("");
    setDescricao("");
    setPreco("");
    setEstoque("");
    setCategoria("");
    setLoja("");
    setProdutoEditando(null);
  }

  function cancelarEdicao() {
    limparFormulario();
    setMensagem("Edição cancelada.");
  }

  async function excluirProduto(id: string) {
    const token = localStorage.getItem("token");

    if (!token) {
      setMensagem("Token não encontrado.");
      return;
    }

    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este produto?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(
        `${API_URL}/api/produtos/${id}`,
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
          dados.mensagem || "Erro ao excluir produto."
        );
        return;
      }

      setProdutos((produtosAtuais) =>
        produtosAtuais.filter(
          (produto) => produto._id !== id
        )
      );

      setMensagem("Produto excluído com sucesso!");
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <section>
      <h2>
        {produtoEditando ? "Editar produto" : "Criar produto"}
      </h2>

      {mensagem && <p>{mensagem}</p>}

      <form onSubmit={salvarProduto}>
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
          <label>Preço</label>
          <br />

          <input
            type="number"
            step="0.01"
            value={preco}
            onChange={(evento) =>
              setPreco(evento.target.value)
            }
            required
          />
        </div>

        <br />

        <div>
          <label>Estoque</label>
          <br />

          <input
            type="number"
            value={estoque}
            onChange={(evento) =>
              setEstoque(evento.target.value)
            }
            required
          />
        </div>

        <br />

        <div>
          <label>Categoria</label>
          <br />

          <input
            type="text"
            value={categoria}
            onChange={(evento) =>
              setCategoria(evento.target.value)
            }
            required
          />
        </div>

        <br />

        <div>
          <label>Loja</label>
          <br />

          <select
            value={loja}
            onChange={(evento) =>
              setLoja(evento.target.value)
            }
            required
          >
            <option value="">
              Selecione uma loja
            </option>

            {lojas.map((loja) => (
              <option
                key={loja._id}
                value={loja._id}
              >
                {loja.nome}
              </option>
            ))}
          </select>
        </div>

        <br />

        <button
          type="submit"
          className="admin-button"
        >
          {produtoEditando
            ? "Salvar alterações"
            : "Criar produto"}
        </button>

        {produtoEditando && (
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

      <h2>Produtos cadastrados</h2>

      {produtos.map((produto) => (
        <div
          key={produto._id}
          className="admin-card"
        >
          <h3>{produto.nome}</h3>

          <p>{produto.descricao}</p>

          <p>
            <strong>Preço:</strong>{" "}
            R$ {produto.preco.toFixed(2)}
          </p>

          <p>
            <strong>Estoque:</strong>{" "}
            {produto.estoque}
          </p>

          <p>
            <strong>Categoria:</strong>{" "}
            {produto.categoria}
          </p>

          <p>
            <strong>Loja:</strong>{" "}
            {produto.loja?.nome}
          </p>

          <button
            className="admin-button"
            onClick={() => editarProduto(produto)}
          >
            Editar
          </button>

          <button
            className="admin-button danger"
            onClick={() =>
              excluirProduto(produto._id)
            }
          >
            Excluir produto
          </button>
        </div>
      ))}
    </section>
  );
}

export default ProdutoAdmin;