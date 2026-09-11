import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  PackageSearch,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Store,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import productFlower from "../assets/products/product-flower.webp";
import productGummies from "../assets/products/product-gummies.webp";
import productPrerolls from "../assets/products/product-prerolls.webp";
import productResin from "../assets/products/product-resin.webp";
import productVape from "../assets/products/product-vape.webp";
import Card from "../components/ui/Card";
import Container from "../components/ui/Container";
import { useCarrinho } from "../context/CarrinhoContext";
import "../styles/produtos.css";

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
  loja: Loja | null;
};

type Ordem = "relevantes" | "menor-preco" | "maior-preco" | "nome";

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

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function Produtos() {
  const [parametros, setParametros] = useSearchParams();
  const { adicionarProduto } = useCarrinho();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState(
    parametros.get("categoria") || "Todos",
  );
  const [ordem, setOrdem] = useState<Ordem>("relevantes");
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Busca os produtos reais da API.
  useEffect(() => {
    const controle = new AbortController();

    async function carregarProdutos() {
      try {
        const resposta = await fetch(`${API_URL}/api/produtos`, {
          signal: controle.signal,
        });

        if (!resposta.ok) {
          throw new Error("Erro ao buscar produtos");
        }

        const resultado = await resposta.json();
        const lista: Produto[] = Array.isArray(resultado)
          ? resultado
          : resultado.produtos ?? [];

        setProdutos(
          lista.filter((produto) => produto.ativo !== false && produto.estoque > 0),
        );
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setErro("Não foi possível carregar os produtos.");
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

  const categorias = useMemo(
    () => ["Todos", ...new Set(produtos.map((produto) => produto.categoria))],
    [produtos],
  );

  const produtosVisiveis = useMemo(() => {
    const termo = normalizar(busca.trim());

    const filtrados = produtos.filter((produto) => {
      const correspondeCategoria =
        categoriaAtiva === "Todos" || produto.categoria === categoriaAtiva;
      const conteudo = normalizar(
        `${produto.nome} ${produto.descricao || ""} ${produto.categoria} ${produto.loja?.nome || ""}`,
      );

      return correspondeCategoria && (!termo || conteudo.includes(termo));
    });

    if (ordem === "menor-preco") {
      return [...filtrados].sort((a, b) => a.preco - b.preco);
    }

    if (ordem === "maior-preco") {
      return [...filtrados].sort((a, b) => b.preco - a.preco);
    }

    if (ordem === "nome") {
      return [...filtrados].sort((a, b) => a.nome.localeCompare(b.nome));
    }

    return filtrados;
  }, [busca, categoriaAtiva, ordem, produtos]);

  function selecionarCategoria(categoria: string) {
    setCategoriaAtiva(categoria);

    if (categoria === "Todos") {
      setParametros({});
    } else {
      setParametros({ categoria });
    }
  }

  function alternarFavorito(id: string) {
    setFavoritos((atuais) => {
      const novos = new Set(atuais);

      if (novos.has(id)) {
        novos.delete(id);
      } else {
        novos.add(id);
      }

      return novos;
    });
  }

  function adicionar(produto: Produto) {
    if (!produto.loja) {
      setMensagem("Este produto não possui uma loja disponível.");
      return;
    }

    const erroCarrinho = adicionarProduto(produto);
    setMensagem(
      erroCarrinho || `${produto.nome} foi adicionado ao seu carrinho.`,
    );
  }

  if (carregando) {
    return (
      <main className="ihemp-products-page">
        <Container>
          <div className="products-page__loading">Carregando produtos...</div>
        </Container>
      </main>
    );
  }

  return (
    <main className="ihemp-products-page">
      <Container>
        <header className="products-page__header">
          <div>
            <span>Catálogo IHEMP</span>
            <h1>Todos os produtos</h1>
            <p>Encontre produtos selecionados das melhores lojas parceiras.</p>
          </div>

          <div className="products-page__search">
            <Search size={20} aria-hidden="true" />
            <input
              type="search"
              value={busca}
              onChange={(evento) => setBusca(evento.target.value)}
              placeholder="Buscar no catálogo..."
              aria-label="Buscar produtos no catálogo"
            />
          </div>
        </header>

        <section className="products-filters" aria-label="Filtros dos produtos">
          <div className="products-filters__categories">
            {categorias.map((categoria) => (
              <button
                className={categoriaAtiva === categoria ? "is-active" : ""}
                type="button"
                key={categoria}
                onClick={() => selecionarCategoria(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>

          <label className="products-filters__order">
            <SlidersHorizontal size={17} aria-hidden="true" />
            <span>Ordenar:</span>
            <select
              value={ordem}
              onChange={(evento) => setOrdem(evento.target.value as Ordem)}
            >
              <option value="relevantes">Mais relevantes</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
              <option value="nome">Nome A–Z</option>
            </select>
          </label>
        </section>

        <div className="products-results">
          <strong>{produtosVisiveis.length} produtos encontrados</strong>
          {categoriaAtiva !== "Todos" && <span>Categoria: {categoriaAtiva}</span>}
        </div>

        {mensagem && (
          <p className="products-page__notice" role="status">
            {mensagem}
          </p>
        )}

        {erro ? (
          <Card variant="soft">
            <p className="products-page__message">{erro}</p>
          </Card>
        ) : produtosVisiveis.length === 0 ? (
          <Card className="products-empty" variant="soft">
            <PackageSearch size={36} aria-hidden="true" />
            <h2>Nenhum produto encontrado</h2>
            <p>Tente mudar a busca ou selecionar outra categoria.</p>
          </Card>
        ) : (
          <section className="products-grid" aria-label="Catálogo de produtos">
            {produtosVisiveis.map((produto, indice) => {
              const favorito = favoritos.has(produto._id);

              return (
                <Card
                  className="products-card"
                  interactive
                  key={produto._id}
                  padding="none"
                  variant="outlined"
                >
                  <Link
                    className="products-card__image"
                    to={`/produtos/${produto._id}`}
                    aria-label={`Ver detalhes de ${produto.nome}`}
                  >
                    <img src={imagemProduto(produto)} alt={produto.nome} />
                    {indice === 0 && <span>Mais vendido</span>}
                  </Link>

                  <button
                    className={`products-card__favorite ${favorito ? "is-favorite" : ""}`}
                    type="button"
                    onClick={() => alternarFavorito(produto._id)}
                    aria-label={favorito ? "Remover dos favoritos" : "Favoritar produto"}
                    aria-pressed={favorito}
                  >
                    <Heart size={19} fill={favorito ? "currentColor" : "none"} />
                  </button>

                  <div className="products-card__content">
                    <span>{produto.categoria}</span>
                    <Link to={`/produtos/${produto._id}`}>
                      <h2>{produto.nome}</h2>
                    </Link>
                    <p>{produto.descricao || "Produto selecionado IHEMP."}</p>

                    <div className="products-card__store">
                      <Store size={15} aria-hidden="true" />
                      <span>{produto.loja?.nome || "Loja não disponível"}</span>
                      {produto.loja && <ShieldCheck size={15} aria-label="Loja verificada" />}
                    </div>

                    <div className="products-card__footer">
                      <strong>{formatadorPreco.format(produto.preco)}</strong>
                      <button
                        type="button"
                        onClick={() => adicionar(produto)}
                        disabled={!produto.loja || produto.estoque <= 0}
                        aria-label={`Adicionar ${produto.nome} ao carrinho`}
                      >
                        <Plus size={20} strokeWidth={2.5} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </section>
        )}
      </Container>
    </main>
  );
}

export default Produtos;
