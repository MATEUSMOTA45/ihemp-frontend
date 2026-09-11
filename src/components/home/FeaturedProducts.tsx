import { useEffect, useState } from "react";
import { Plus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

import productFlower from "../../assets/products/product-flower.webp";
import productGummies from "../../assets/products/product-gummies.webp";
import productPrerolls from "../../assets/products/product-prerolls.webp";
import productResin from "../../assets/products/product-resin.webp";
import productVape from "../../assets/products/product-vape.webp";
import { useCarrinho } from "../../context/CarrinhoContext";
import "../../styles/home-products.css";
import { fetchComTentativas } from "../../utils/fetchComTentativas";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

const API_URL = import.meta.env.VITE_API_URL;

type Loja = {
  _id: string;
  nome: string;
};

type Produto = {
  _id: string;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  categoria: string;
  ativo?: boolean;
  imagem?: string;
  imagemUrl?: string;
  vendas?: number;
  vendidos?: number;
  loja: Loja | null;
};

const formatadorPreco = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const imagensFallback = [
  productFlower,
  productGummies,
  productVape,
  productPrerolls,
  productResin,
];

function imagemFallback(produto: Produto, indice: number) {
  const texto = `${produto.nome} ${produto.categoria}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (texto.includes("gummi") || texto.includes("comest")) {
    return productGummies;
  }

  if (texto.includes("vape") || texto.includes("cartucho")) {
    return productVape;
  }

  if (texto.includes("pre-roll") || texto.includes("preroll")) {
    return productPrerolls;
  }

  if (texto.includes("resin") || texto.includes("concentr")) {
    return productResin;
  }

  // Alterna as imagens quando o produto ainda tem uma categoria de teste.
  return imagensFallback[indice % imagensFallback.length];
}

function FeaturedProducts() {
  const { adicionarProduto } = useCarrinho();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Busca os produtos reais e prioriza os que tiverem mais vendas.
  useEffect(() => {
    const controle = new AbortController();

    async function carregarProdutos() {
      try {
        const resposta = await fetchComTentativas(`${API_URL}/api/produtos`, {
          signal: controle.signal,
        });

        if (!resposta.ok) {
          throw new Error("Falha ao buscar produtos");
        }

        const resultado = await resposta.json();
        const lista: Produto[] = Array.isArray(resultado)
          ? resultado
          : resultado.produtos ?? [];

        setProdutos(
          lista
            .filter((produto) => produto.ativo !== false && produto.estoque > 0)
            .sort(
              (produtoA, produtoB) =>
                (produtoB.vendas ?? produtoB.vendidos ?? 0) -
                (produtoA.vendas ?? produtoA.vendidos ?? 0),
            )
            .slice(0, 5),
        );
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setErro("Não foi possível carregar os produtos agora.");
        }
      } finally {
        if (!controle.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarProdutos();

    return () => controle.abort();
  }, []);

  function adicionar(produto: Produto) {
    const erroCarrinho = adicionarProduto(produto);

    setMensagem(
      erroCarrinho || `${produto.nome} foi adicionado ao seu carrinho.`,
    );
  }

  return (
    <section className="home-section" aria-labelledby="produtos-title">
      <div className="home-section__header">
        <div>
          <span className="home-section__eyebrow">Escolhas do público</span>
          <h2 id="produtos-title">Mais vendidos</h2>
        </div>

        <Link to="/produtos">
          Ver todos
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {mensagem && (
        <p className="home-products__notice" role="status">
          {mensagem}
        </p>
      )}

      {carregando && (
        <div className="home-products" aria-label="Carregando produtos">
          {[1, 2, 3, 4, 5].map((item) => (
            <div className="home-product-skeleton" key={item} />
          ))}
        </div>
      )}

      {!carregando && erro && (
        <Card variant="soft">
          <p className="home-products__message">{erro}</p>
        </Card>
      )}

      {!carregando && !erro && produtos.length === 0 && (
        <Card variant="soft">
          <p className="home-products__message">
            Ainda não existem produtos disponíveis.
          </p>
        </Card>
      )}

      {!carregando && !erro && produtos.length > 0 && (
        <div className="home-products">
          {produtos.map((produto, indice) => (
            <Card
              className="home-product"
              interactive
              key={produto._id}
              padding="none"
              variant="outlined"
            >
              <div className="home-product__image">
                <img
                  src={imagemFallback(produto, indice)}
                  alt={produto.nome}
                />

                {indice === 0 && (
                  <Badge variant="danger" size="small">
                    Mais vendido
                  </Badge>
                )}
              </div>

              <div className="home-product__body">
                <h3>{produto.nome}</h3>
                <p>{produto.categoria}</p>

                {produto.loja && (
                  <span className="home-product__store">
                    <ShoppingBag size={14} aria-hidden="true" />
                    {produto.loja.nome}
                  </span>
                )}

                <div className="home-product__footer">
                  <strong>{formatadorPreco.format(produto.preco)}</strong>

                  <button
                    type="button"
                    onClick={() => adicionar(produto)}
                    aria-label={`Adicionar ${produto.nome} ao carrinho`}
                    title="Adicionar ao carrinho"
                  >
                    <Plus size={20} strokeWidth={2.4} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

export default FeaturedProducts;
