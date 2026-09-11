import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bike,
  Heart,
  Plus,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Tag,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import productFlower from "../assets/products/product-flower.webp";
import productGummies from "../assets/products/product-gummies.webp";
import productPrerolls from "../assets/products/product-prerolls.webp";
import productResin from "../assets/products/product-resin.webp";
import productVape from "../assets/products/product-vape.webp";
import store01 from "../assets/stores/store-01.webp";
import store02 from "../assets/stores/store-02.webp";
import store03 from "../assets/stores/store-03.webp";
import store04 from "../assets/stores/store-04.webp";
import Card from "../components/ui/Card";
import Container from "../components/ui/Container";
import { useCarrinho } from "../context/CarrinhoContext";
import "../styles/loja.css";

const API_URL = import.meta.env.VITE_API_URL;

type LojaResumo = {
  _id: string;
  nome: string;
};

type Loja = LojaResumo & {
  descricao?: string;
  endereco?: string;
  imagem?: string;
  imagemUrl?: string;
  ativa?: boolean;
  ativo?: boolean;
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

const capasFallback = [store01, store02, store03, store04];
const produtosFallback = [
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
function imagemProduto(produto: Produto, indice: number) {
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

  if (texto.includes("flor")) {
    return productFlower;
  }

  return produtosFallback[indice % produtosFallback.length];
}

function Loja() {
  const navigate = useNavigate();
  const { lojaId } = useParams();
  const { adicionarProduto } = useCarrinho();

  const [loja, setLoja] = useState<Loja | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [favorita, setFavorita] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [indiceLoja, setIndiceLoja] = useState(0);

  // Busca a loja selecionada e seus produtos reais no backend.
  useEffect(() => {
    const controle = new AbortController();

    async function carregarLoja() {
      try {
        const [respostaLojas, respostaProdutos] = await Promise.all([
          fetch(`${API_URL}/api/lojas`, { signal: controle.signal }),
          fetch(`${API_URL}/api/produtos`, { signal: controle.signal }),
        ]);

        if (!respostaLojas.ok || !respostaProdutos.ok) {
          throw new Error("Falha ao buscar a loja");
        }

        const resultadoLojas = await respostaLojas.json();
        const resultadoProdutos = await respostaProdutos.json();

        const lojas: Loja[] = Array.isArray(resultadoLojas)
          ? resultadoLojas
          : resultadoLojas.lojas ?? [];

        const listaProdutos: Produto[] = Array.isArray(resultadoProdutos)
          ? resultadoProdutos
          : resultadoProdutos.produtos ?? [];

        const indiceEncontrado = lojas.findIndex(
          (item) => item._id === lojaId,
        );
        const lojaEncontrada = lojas[indiceEncontrado];

        if (!lojaEncontrada) {
          throw new Error("Loja não encontrada");
        }

        setIndiceLoja(Math.max(indiceEncontrado, 0));
        setLoja(lojaEncontrada);
        setProdutos(
          listaProdutos.filter(
            (produto) =>
              produto.ativo !== false &&
              produto.estoque > 0 &&
              produto.loja?._id === lojaEncontrada._id,
          ),
        );
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setErro("Não foi possível carregar esta loja.");
        }
      } finally {
        if (!controle.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarLoja();

    return () => controle.abort();
  }, [lojaId]);

  const categorias = useMemo(
    () => ["Todos", ...new Set(produtos.map((produto) => produto.categoria))],
    [produtos],
  );

  const produtosFiltrados = useMemo(
    () =>
      categoriaAtiva === "Todos"
        ? produtos
        : produtos.filter((produto) => produto.categoria === categoriaAtiva),
    [categoriaAtiva, produtos],
  );

  function adicionar(produto: Produto) {
    const erroCarrinho = adicionarProduto(produto);

    setMensagem(
      erroCarrinho || `${produto.nome} foi adicionado ao seu carrinho.`,
    );
  }

  async function compartilhar() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: loja?.nome,
          text: `Confira a loja ${loja?.nome} no IHEMP.`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setMensagem("Link da loja copiado.");
      }
    } catch {
      // O usuário pode fechar a janela de compartilhamento sem escolher uma opção.
    }
  }

  if (carregando) {
    return (
      <main className="ihemp-store-page">
        <Container>
          <div className="store-page__loading">Carregando loja...</div>
        </Container>
      </main>
    );
  }

  if (erro || !loja) {
    return (
      <main className="ihemp-store-page">
        <Container>
          <Card variant="soft">
            <p className="store-page__message">
              {erro || "Loja não encontrada."}
            </p>
          </Card>
        </Container>
      </main>
    );
  }

  const capa =
    loja.imagem ||
    loja.imagemUrl ||
    capasFallback[indiceLoja % capasFallback.length];

  return (
    <main className="ihemp-store-page">
      <Container>
        <div className="store-page__toolbar">
          <button type="button" onClick={() => navigate(-1)}>
            <ArrowLeft size={21} aria-hidden="true" />
            <span>Voltar</span>
          </button>

          <div>
            <button
              type="button"
              onClick={compartilhar}
              aria-label="Compartilhar loja"
            >
              <Share2 size={20} aria-hidden="true" />
            </button>

            <button
              className={favorita ? "is-favorite" : ""}
              type="button"
              onClick={() => setFavorita((valor) => !valor)}
              aria-label={favorita ? "Remover dos favoritos" : "Favoritar loja"}
              aria-pressed={favorita}
            >
              <Heart size={21} fill={favorita ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        <section className="store-hero">
          <img src={capa} alt={`Interior da loja ${loja.nome}`} />

          <div className="store-hero__overlay">
            <span>Aberta agora</span>
            <h1>{loja.nome}</h1>

            <div className="store-hero__rating">
              <Star size={17} fill="currentColor" aria-hidden="true" />
              <strong>4,9</strong>
              <span>(1.234 avaliações)</span>
              <ShieldCheck size={18} aria-label="Loja verificada" />
            </div>

            {loja.descricao && <p>{loja.descricao}</p>}
          </div>
        </section>

        <section className="store-highlights" aria-label="Informações da loja">
          <article>
            <Bike size={22} aria-hidden="true" />
            <div>
              <strong>Entrega</strong>
              <span>25–35 min</span>
            </div>
          </article>

          <article>
            <ShoppingBag size={22} aria-hidden="true" />
            <div>
              <strong>Pedido mínimo</strong>
              <span>R$ 50,00</span>
            </div>
          </article>

          <article>
            <Tag size={22} aria-hidden="true" />
            <div>
              <strong>Frete grátis</strong>
              <span>Acima de R$ 120</span>
            </div>
          </article>
        </section>

        <nav className="store-tabs" aria-label="Categorias da loja">
          {categorias.map((categoria) => (
            <button
              className={categoriaAtiva === categoria ? "is-active" : ""}
              type="button"
              key={categoria}
              onClick={() => setCategoriaAtiva(categoria)}
            >
              {categoria}
            </button>
          ))}
        </nav>

        <div className="store-products__heading">
          <div>
            <span>Catálogo</span>
            <h2>Produtos da loja</h2>
          </div>

          <span>{produtosFiltrados.length} produtos</span>
        </div>

        {mensagem && (
          <p className="store-page__notice" role="status">
            {mensagem}
          </p>
        )}

        {produtosFiltrados.length === 0 ? (
          <Card variant="soft">
            <p className="store-page__message">
              Esta loja ainda não possui produtos disponíveis.
            </p>
          </Card>
        ) : (
          <section className="store-products" aria-label="Produtos da loja">
            {produtosFiltrados.map((produto, indice) => (
              <Card
                className="store-product"
                interactive
                key={produto._id}
                padding="none"
                variant="outlined"
              >
                <Link
                className="store-product__link"
                to={`/produtos/${produto._id}`}
                aria-label={`Ver detalhes de ${produto.nome}`}
              >
                <div className="store-product__image">
                  <img
                    src={imagemProduto(produto, indice)}
                    alt={produto.nome}
                  />

                  {indice === 0 && <span>Mais vendido</span>}
                </div>
               </Link>

                <div className="store-product__content">
                  <h3>{produto.nome}</h3>
                  <p>{produto.categoria}</p>

                  <div>
                    <strong>{formatadorPreco.format(produto.preco)}</strong>

                    <button
                      type="button"
                      onClick={() => adicionar(produto)}
                      aria-label={`Adicionar ${produto.nome} ao carrinho`}
                    >
                      <Plus size={20} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </section>
        )}
      </Container>
    </main>
  );
}

export default Loja;
