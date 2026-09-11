import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

import productFlower from "../../assets/products/product-flower.webp";
import productGummies from "../../assets/products/product-gummies.webp";
import productPrerolls from "../../assets/products/product-prerolls.webp";
import productVape from "../../assets/products/product-vape.webp";
import { useCarrinho } from "../../context/CarrinhoContext";
import "../../styles/home-offers.css";

const API_URL = import.meta.env.VITE_API_URL;

type Loja = {
  _id: string;
  nome: string;
};

type Produto = {
  _id: string;
  nome: string;
  preco: number;
  estoque: number;
  categoria: string;
  ativo?: boolean;
  loja: Loja | null;
};

const descontos = [15, 20, 10, 15];
const imagensOferta = [
  productFlower,
  productGummies,
  productVape,
  productPrerolls,
];

const formatadorPreco = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function OffersSection() {
  const { adicionarProduto } = useCarrinho();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  // Busca quatro produtos reais para montar as ofertas da Home.
  useEffect(() => {
    const controle = new AbortController();

    async function carregarOfertas() {
      try {
        const resposta = await fetch(`${API_URL}/api/produtos`, {
          signal: controle.signal,
        });

        if (!resposta.ok) {
          throw new Error("Falha ao buscar ofertas");
        }

        const resultado = await resposta.json();
        const lista: Produto[] = Array.isArray(resultado)
          ? resultado
          : resultado.produtos ?? [];

        setProdutos(
          lista
            .filter((produto) => produto.ativo !== false && produto.estoque > 0)
            .slice(0, 4),
        );
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setProdutos([]);
        }
      } finally {
        if (!controle.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarOfertas();

    return () => controle.abort();
  }, []);

  function adicionar(produto: Produto) {
    const erroCarrinho = adicionarProduto(produto);

    setMensagem(
      erroCarrinho || `${produto.nome} foi adicionado ao seu carrinho.`,
    );
  }

  return (
    <section className="home-section" aria-labelledby="ofertas-title">
      <div className="home-section__header">
        <div>
          <span className="home-section__eyebrow">Preços especiais</span>
          <h2 id="ofertas-title">Ofertas para você</h2>
        </div>

        <Link to="/produtos">
          Ver todas
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {mensagem && (
        <p className="home-offers__notice" role="status">
          {mensagem}
        </p>
      )}

      {carregando && (
        <div className="home-offers" aria-label="Carregando ofertas">
          {[1, 2, 3, 4].map((item) => (
            <div className="home-offer-skeleton" key={item} />
          ))}
        </div>
      )}

      {!carregando && produtos.length > 0 && (
        <div className="home-offers">
          {produtos.map((produto, indice) => {
            const desconto = descontos[indice];
            const precoAnterior = produto.preco / (1 - desconto / 100);

            return (
              <article className="home-offer" key={produto._id}>
                <div className="home-offer__image">
                  <img
                    src={imagensOferta[indice % imagensOferta.length]}
                    alt={produto.nome}
                  />

                  <span>{desconto}% OFF</span>
                </div>

                <div className="home-offer__content">
                  <h3>{produto.nome}</h3>
                  <p>{produto.categoria}</p>

                  <div className="home-offer__prices">
                    <s>{formatadorPreco.format(precoAnterior)}</s>
                    <strong>{formatadorPreco.format(produto.preco)}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => adicionar(produto)}
                  aria-label={`Adicionar ${produto.nome} ao carrinho`}
                  title="Adicionar ao carrinho"
                >
                  <Plus size={19} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default OffersSection;
