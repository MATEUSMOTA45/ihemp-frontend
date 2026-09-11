import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Truck,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import productFlower from "../assets/products/product-flower.webp";
import productGummies from "../assets/products/product-gummies.webp";
import productPrerolls from "../assets/products/product-prerolls.webp";
import productResin from "../assets/products/product-resin.webp";
import productVape from "../assets/products/product-vape.webp";
import Card from "../components/ui/Card";
import Container from "../components/ui/Container";
import { useCarrinho } from "../context/CarrinhoContext";
import "../styles/produto.css";

const API_URL = import.meta.env.VITE_API_URL;

type LojaResumo = {
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
  loja: LojaResumo | null;
};

const imagensFallback = [
  productFlower,
  productGummies,
  productVape,
  productPrerolls,
  productResin,
];

const formatadorPreco = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function imagemProduto(produto: Produto) {
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

  if (
    texto.includes("pre-roll") ||
    texto.includes("preroll") ||
    texto.includes("bolado")
  ) {
    return productPrerolls;
  }

  if (texto.includes("resin") || texto.includes("concentr")) {
    return productResin;
  }

  return productFlower;
}

function Produto() {
  const navigate = useNavigate();
  const { produtoId } = useParams();
  const { adicionarProduto, itens } = useCarrinho();

  const [produto, setProduto] = useState<Produto | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [quantidade, setQuantidade] = useState(1);
  const [favorito, setFavorito] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  // Busca o produto selecionado no backend.
  useEffect(() => {
  window.scrollTo({ top: 0, behavior: "auto" });

  const controle = new AbortController();

    async function carregarProduto() {
      try {
        const resposta = await fetch(`${API_URL}/api/produtos`, {
          signal: controle.signal,
        });

        if (!resposta.ok) {
          throw new Error("Falha ao buscar produto");
        }

        const resultado = await resposta.json();
        const lista: Produto[] = Array.isArray(resultado)
          ? resultado
          : resultado.produtos ?? [];

        const encontrado = lista.find((item) => item._id === produtoId);

        if (!encontrado) {
          throw new Error("Produto não encontrado");
        }

        setProdutos(lista.filter((item) => item.ativo !== false));
        setProduto(encontrado);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setErro("Não foi possível carregar este produto.");
        }
      } finally {
        if (!controle.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarProduto();

    return () => controle.abort();
  }, [produtoId]);

  const quantidadeNoCarrinho = useMemo(
    () =>
      itens.find((item) => item.produto._id === produto?._id)?.quantidade ?? 0,
    [itens, produto?._id],
  );

  const relacionados = useMemo(
    () =>
      produtos
        .filter(
          (item) =>
            item._id !== produto?._id &&
            item.estoque > 0 &&
            (item.categoria === produto?.categoria ||
              item.loja?._id === produto?.loja?._id),
        )
        .slice(0, 3),
    [produto, produtos],
  );

  function diminuirQuantidade() {
    setQuantidade((valor) => Math.max(1, valor - 1));
  }

  function aumentarQuantidade() {
    if (!produto) return;

    const limite = Math.max(1, produto.estoque - quantidadeNoCarrinho);
    setQuantidade((valor) => Math.min(limite, valor + 1));
  }

  function adicionarAoCarrinho() {
    if (!produto) return;

    const disponivel = produto.estoque - quantidadeNoCarrinho;

    if (disponivel <= 0) {
      setMensagem("Quantidade máxima em estoque atingida.");
      return;
    }

    const totalAdicionar = Math.min(quantidade, disponivel);
    const erroCarrinho = adicionarProduto(produto);

    if (erroCarrinho) {
      setMensagem(erroCarrinho);
      return;
    }

    for (let indice = 1; indice < totalAdicionar; indice += 1) {
      adicionarProduto(produto);
    }

    setMensagem(
      `${totalAdicionar} ${totalAdicionar === 1 ? "unidade adicionada" : "unidades adicionadas"} ao carrinho.`,
    );
    setQuantidade(1);
  }

  async function compartilhar() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: produto?.nome,
          text: `Confira ${produto?.nome} no IHEMP.`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setMensagem("Link do produto copiado.");
      }
    } catch {
      // O usuário pode fechar a janela de compartilhamento.
    }
  }

  if (carregando) {
    return (
      <main className="ihemp-product-page">
        <Container>
          <div className="product-page__loading">Carregando produto...</div>
        </Container>
      </main>
    );
  }

  if (erro || !produto) {
    return (
      <main className="ihemp-product-page">
        <Container>
          <Card variant="soft">
            <p className="product-page__message">
              {erro || "Produto não encontrado."}
            </p>
          </Card>
        </Container>
      </main>
    );
  }

  const imagemPrincipal = imagemProduto(produto);
  const limiteQuantidade = Math.max(1, produto.estoque - quantidadeNoCarrinho);

  return (
    <main className="ihemp-product-page">
      <Container>
        <div className="product-page__toolbar">
          <button type="button" onClick={() => navigate(-1)}>
            <ArrowLeft size={21} aria-hidden="true" />
            <span>Voltar</span>
          </button>

          <div>
            <button
              type="button"
              onClick={compartilhar}
              aria-label="Compartilhar produto"
            >
              <Share2 size={20} aria-hidden="true" />
            </button>

            <button
              className={favorito ? "is-favorite" : ""}
              type="button"
              onClick={() => setFavorito((valor) => !valor)}
              aria-label={favorito ? "Remover dos favoritos" : "Favoritar produto"}
              aria-pressed={favorito}
            >
              <Heart size={21} fill={favorito ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        <section className="product-detail">
          <div className="product-gallery">
            <span className="product-gallery__badge">Mais vendido</span>

            <div className="product-gallery__main">
              <img src={imagemPrincipal} alt={produto.nome} />
            </div>

            <div className="product-gallery__thumbs" aria-label="Fotos do produto">
              <button className="is-active" type="button">
                <img src={imagemPrincipal} alt={`${produto.nome} - foto principal`} />
              </button>

              {imagensFallback
                .filter((imagem) => imagem !== imagemPrincipal)
                .slice(0, 3)
                .map((imagem, indice) => (
                  <button type="button" key={imagem} disabled>
                    <img src={imagem} alt={`Sugestão visual ${indice + 1}`} />
                  </button>
                ))}
            </div>
          </div>

          <div className="product-info">
            <span className="product-info__category">{produto.categoria}</span>
            <h1>{produto.nome}</h1>

            <div className="product-info__rating">
              <Star size={17} fill="currentColor" aria-hidden="true" />
              <strong>4,9</strong>
              <span>(128 avaliações)</span>
              <ShieldCheck size={18} aria-label="Produto verificado" />
            </div>

            {produto.loja && (
              <Link className="product-info__store" to={`/lojas/${produto.loja._id}`}>
                <Store size={19} aria-hidden="true" />
                <span>
                  Vendido por <strong>{produto.loja.nome}</strong>
                </span>
              </Link>
            )}

            <p className="product-info__description">
              {produto.descricao ||
                "Produto selecionado de uma loja parceira do IHEMP, com qualidade e procedência."}
            </p>

            <div className="product-info__stock">
              <Check size={17} aria-hidden="true" />
              <span>Em estoque</span>
              <small>{produto.estoque} unidades disponíveis</small>
            </div>

            <div className="product-info__price">
              <span>Preço</span>
              <strong>{formatadorPreco.format(produto.preco)}</strong>
              <small>à vista</small>
            </div>

            <div className="product-purchase">
              <div className="product-quantity" aria-label="Quantidade">
                <button
                  type="button"
                  onClick={diminuirQuantidade}
                  disabled={quantidade === 1}
                  aria-label="Diminuir quantidade"
                >
                  <Minus size={18} aria-hidden="true" />
                </button>
                <strong>{quantidade}</strong>
                <button
                  type="button"
                  onClick={aumentarQuantidade}
                  disabled={quantidade >= limiteQuantidade}
                  aria-label="Aumentar quantidade"
                >
                  <Plus size={18} aria-hidden="true" />
                </button>
              </div>

              <button
                className="product-add-button"
                type="button"
                onClick={adicionarAoCarrinho}
                disabled={quantidadeNoCarrinho >= produto.estoque}
              >
                <ShoppingBag size={20} aria-hidden="true" />
                Adicionar ao carrinho
              </button>
            </div>

            {mensagem && (
              <p className="product-page__notice" role="status">
                {mensagem}
              </p>
            )}

            <div className="product-delivery">
              <Truck size={22} aria-hidden="true" />
              <div>
                <strong>Entrega rápida e discreta</strong>
                <span>Calcule o prazo no carrinho</span>
              </div>
            </div>
          </div>
        </section>

        <section className="product-about">
          <div>
            <span>Detalhes</span>
            <h2>Sobre o produto</h2>
          </div>

          <p>
            {produto.descricao ||
              `${produto.nome} pertence à categoria ${produto.categoria}. Confira disponibilidade, preço e condições da loja antes de finalizar sua compra.`}
          </p>
        </section>

        {relacionados.length > 0 && (
          <section className="product-related">
            <div className="product-related__heading">
              <span>Você também pode gostar</span>
              <h2>Produtos relacionados</h2>
            </div>

            <div className="product-related__grid">
              {relacionados.map((item) => (
                <Link to={`/produtos/${item._id}`} key={item._id}>
                  <Card className="product-related__card" interactive padding="none">
                    <img src={imagemProduto(item)} alt={item.nome} />
                    <div>
                      <span>{item.categoria}</span>
                      <h3>{item.nome}</h3>
                      <strong>{formatadorPreco.format(item.preco)}</strong>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
    </main>
  );
}

export default Produto;
