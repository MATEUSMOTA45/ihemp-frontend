import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import productFlower from "../assets/products/product-flower.webp";
import productGummies from "../assets/products/product-gummies.webp";
import productPrerolls from "../assets/products/product-prerolls.webp";
import productResin from "../assets/products/product-resin.webp";
import productVape from "../assets/products/product-vape.webp";
import Card from "../components/ui/Card";
import Container from "../components/ui/Container";
import { useCarrinho } from "../context/CarrinhoContext";
import "../styles/carrinho.css";

const VALOR_FRETE_GRATIS = 120;

type Mensagem = {
  texto: string;
  tipo: "sucesso" | "erro";
};

const formatadorPreco = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function imagemProduto(nome: string, categoria = "") {
  const texto = `${nome} ${categoria}`
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

function Carrinho() {
  const navigate = useNavigate();
  const {
    itens,
    alterarQuantidade,
    removerProduto,
    limparCarrinho,
  } = useCarrinho();

  const [mensagem, setMensagem] = useState<Mensagem | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const quantidadeTotal = itens.reduce(
    (total, item) => total + item.quantidade,
    0,
  );

  const subtotal = itens.reduce(
    (total, item) => total + item.produto.preco * item.quantidade,
    0,
  );

  const faltaParaFrete = Math.max(VALOR_FRETE_GRATIS - subtotal, 0);
  const progressoFrete = Math.min((subtotal / VALOR_FRETE_GRATIS) * 100, 100);

  // Leva o usuário para preencher entrega e pagamento.
  function irParaCheckout() {
    const token = localStorage.getItem("token");

    if (!token) {
      setMensagem({
        texto: "Você precisa fazer login para finalizar o pedido.",
        tipo: "erro",
      });
      return;
    }

    if (itens.length === 0) {
      setMensagem({ texto: "Seu carrinho está vazio.", tipo: "erro" });
      return;
    }

    const primeiraLoja = itens[0].produto.loja?._id;

    if (!primeiraLoja) {
      setMensagem({
        texto: "Loja do produto não encontrada.",
        tipo: "erro",
      });
      return;
    }

    const lojasDiferentes = itens.some(
      (item) => item.produto.loja?._id !== primeiraLoja,
    );

    if (lojasDiferentes) {
      setMensagem({
        texto: "Os produtos precisam pertencer à mesma loja.",
        tipo: "erro",
      });
      return;
    }

    setMensagem(null);
    navigate("/checkout");
  }

  return (
    <main className="ihemp-cart-page">
      <Container>
        <header className="cart-page__header">
          <button type="button" onClick={() => navigate(-1)} aria-label="Voltar">
            <ArrowLeft size={21} aria-hidden="true" />
          </button>

          <div>
            <span>Seu pedido</span>
            <h1>Meu carrinho</h1>
          </div>

          {itens.length > 0 ? (
            <button
              className="cart-page__clear"
              type="button"
              onClick={limparCarrinho}
            >
              Limpar
            </button>
          ) : (
            <span className="cart-page__header-space" />
          )}
        </header>

        {mensagem && (
          <p className={`cart-page__notice is-${mensagem.tipo}`} role="status">
            {mensagem.texto}
          </p>
        )}

        {itens.length === 0 ? (
          <Card className="cart-empty" variant="soft">
            <div className="cart-empty__icon">
              <ShoppingBag size={34} aria-hidden="true" />
            </div>
            <h2>Seu carrinho está vazio</h2>
            <p>Explore as lojas e encontre seus produtos favoritos.</p>
            <Link to="/">Explorar produtos</Link>
          </Card>
        ) : (
          <div className="cart-layout">
            <section className="cart-main" aria-label="Itens do carrinho">
              <Card className="cart-shipping" variant="soft">
                <Truck size={22} aria-hidden="true" />
                <div>
                  {faltaParaFrete > 0 ? (
                    <strong>
                      Faltam {formatadorPreco.format(faltaParaFrete)} para ganhar frete grátis
                    </strong>
                  ) : (
                    <strong>Você ganhou frete grátis!</strong>
                  )}

                  <div className="cart-shipping__bar" aria-hidden="true">
                    <span style={{ width: `${progressoFrete}%` }} />
                  </div>

                  <small>
                    {formatadorPreco.format(subtotal)} / {formatadorPreco.format(VALOR_FRETE_GRATIS)}
                  </small>
                </div>
              </Card>

              <div className="cart-store">
                <Store size={19} aria-hidden="true" />
                <span>Vendido por</span>
                <strong>{itens[0].produto.loja?.nome}</strong>
              </div>

              <div className="cart-items">
                {itens.map((item) => (
                  <Card className="cart-item" key={item.produto._id} padding="none">
                    <Link
                      className="cart-item__image"
                      to={`/produtos/${item.produto._id}`}
                      aria-label={`Ver ${item.produto.nome}`}
                    >
                      <img
                        src={imagemProduto(item.produto.nome, item.produto.categoria)}
                        alt={item.produto.nome}
                      />
                    </Link>

                    <div className="cart-item__content">
                      <div>
                        <span>{item.produto.categoria || "Produto IHEMP"}</span>
                        <h2>{item.produto.nome}</h2>
                        <small>{formatadorPreco.format(item.produto.preco)} cada</small>
                      </div>

                      <div className="cart-item__footer">
                        <div className="cart-item__quantity" aria-label="Quantidade">
                          <button
                            type="button"
                            onClick={() =>
                              alterarQuantidade(item.produto._id, item.quantidade - 1)
                            }
                            aria-label="Diminuir quantidade"
                          >
                            <Minus size={17} aria-hidden="true" />
                          </button>
                          <strong>{item.quantidade}</strong>
                          <button
                            type="button"
                            onClick={() =>
                              alterarQuantidade(item.produto._id, item.quantidade + 1)
                            }
                            disabled={item.quantidade >= item.produto.estoque}
                            aria-label="Aumentar quantidade"
                          >
                            <Plus size={17} aria-hidden="true" />
                          </button>
                        </div>

                        <strong>
                          {formatadorPreco.format(item.produto.preco * item.quantidade)}
                        </strong>

                        <button
                          className="cart-item__remove"
                          type="button"
                          onClick={() => removerProduto(item.produto._id)}
                          aria-label={`Remover ${item.produto.nome}`}
                        >
                          <Trash2 size={19} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Link className="cart-continue" to="/">
                <ArrowLeft size={18} aria-hidden="true" />
                Continuar comprando
              </Link>
            </section>

            <aside className="cart-summary">
              <Card className="cart-summary__card">
                <span>Resumo do pedido</span>
                <h2>{quantidadeTotal} {quantidadeTotal === 1 ? "item" : "itens"}</h2>

                <dl>
                  <div>
                    <dt>Subtotal</dt>
                    <dd>{formatadorPreco.format(subtotal)}</dd>
                  </div>
                  <div>
                    <dt>Entrega</dt>
                    <dd>{faltaParaFrete === 0 ? "Grátis" : "A calcular"}</dd>
                  </div>
                  <div>
                    <dt>Desconto</dt>
                    <dd>—</dd>
                  </div>
                </dl>

                <div className="cart-summary__total">
                  <span>Total</span>
                  <strong>{formatadorPreco.format(subtotal)}</strong>
                </div>

                <button
                  type="button"
                  onClick={irParaCheckout}
                >
                  Finalizar pedido
                  <ChevronRight size={19} aria-hidden="true" />
                </button>

                <div className="cart-summary__safe">
                  <ShieldCheck size={19} aria-hidden="true" />
                  <span>Compra segura e dados protegidos</span>
                </div>
              </Card>

              <Card className="cart-summary__delivery" variant="soft">
                <PackageCheck size={22} aria-hidden="true" />
                <div>
                  <strong>Entrega discreta</strong>
                  <span>Embalagem segura na sua porta</span>
                </div>
              </Card>
            </aside>
          </div>
        )}
      </Container>
    </main>
  );
}

export default Carrinho;
