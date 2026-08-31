import { useEffect, useState } from "react";
import { useCarrinho } from "../context/CarrinhoContext";

// URL base da API vinda do arquivo .env
const API_URL = import.meta.env.VITE_API_URL;

// Tipo de loja
type Loja = {
  _id: string;
  nome: string;
};

// Tipo de produto
type Produto = {
  _id: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria: string;
  ativo: boolean;
  loja: Loja | null;
};

function Produtos() {
  // Lista de produtos
  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Controle da tela
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Função do carrinho
  const { adicionarProduto } = useCarrinho();

  // Busca os produtos da API
  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta = await fetch(
          `${API_URL}/api/produtos`
        );

        // Verifica se a API respondeu com erro
        if (!resposta.ok) {
          throw new Error("Erro ao buscar produtos");
        }

        // Converte a resposta para JSON
        const dados = await resposta.json();

        // Salva os produtos no estado
        setProdutos(dados);
      } catch {
        setErro("Não foi possível carregar os produtos.");
      } finally {
        setCarregando(false);
      }
    }

    carregarProdutos();
  }, []);

  // Adiciona um produto ao carrinho
  function adicionarAoCarrinho(produto: Produto) {
    // Verifica se o produto possui uma loja
    if (!produto.loja) {
      setMensagem(
        "Este produto não possui uma loja disponível."
      );
      return;
    }

    // Impede adicionar produto sem estoque
    if (produto.estoque <= 0) {
      setMensagem("Produto sem estoque.");
      return;
    }

    // Tenta adicionar ao carrinho
    const erroCarrinho = adicionarProduto(produto);

    // Mostra erro se não puder adicionar
    if (erroCarrinho) {
      setMensagem(erroCarrinho);
      return;
    }

    // Mostra mensagem de sucesso
    setMensagem(
      `${produto.nome} adicionado ao carrinho!`
    );
  }

  // Mostra enquanto carrega
  if (carregando) {
    return <p>Carregando produtos...</p>;
  }

  // Mostra erro
  if (erro) {
    return <p>{erro}</p>;
  }

  return (
    <main>
      <h1>Produtos</h1>

      {/* Mostra mensagem de sucesso ou erro */}
      {mensagem && <p>{mensagem}</p>}

      {/* Caso não existam produtos */}
      {produtos.length === 0 && (
        <p>Nenhum produto encontrado.</p>
      )}

      {/* Lista os produtos */}
      {produtos.map((produto) => (
        <div key={produto._id}>
          <h2>{produto.nome}</h2>

          <p>{produto.descricao}</p>

          <p>
            Preço: R$ {produto.preco.toFixed(2)}
          </p>

          <p>
            Estoque: {produto.estoque}
          </p>

          <p>
            Categoria: {produto.categoria}
          </p>

          <p>
            Loja:{" "}
            {produto.loja?.nome ||
              "Loja não disponível"}
          </p>

          {/* Adiciona produto ao carrinho */}
          <button
            onClick={() =>
              adicionarAoCarrinho(produto)
            }
            disabled={
              produto.estoque <= 0 ||
              !produto.loja
            }
          >
            Adicionar ao carrinho
          </button>

          <hr />
        </div>
      ))}
    </main>
  );
}

export default Produtos;