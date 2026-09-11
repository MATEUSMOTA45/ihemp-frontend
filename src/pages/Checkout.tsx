import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  MapPin,
  PackageCheck,
  QrCode,
  ShieldCheck,
  Store,
  Truck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import productFlower from "../assets/products/product-flower.webp";
import productGummies from "../assets/products/product-gummies.webp";
import productPrerolls from "../assets/products/product-prerolls.webp";
import productResin from "../assets/products/product-resin.webp";
import productVape from "../assets/products/product-vape.webp";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Container from "../components/ui/Container";
import { useCarrinho } from "../context/CarrinhoContext";
import "../styles/checkout.css";

const API_URL = import.meta.env.VITE_API_URL;
const VALOR_FRETE_GRATIS = 120;

type FormaPagamento = "pix" | "cartao" | "dinheiro";

const nomesPagamento: Record<FormaPagamento, string> = {
  pix: "Pix combinado com a loja",
  cartao: "Cartão na entrega",
  dinheiro: "Dinheiro na entrega",
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

  if (texto.includes("gummi") || texto.includes("comest")) return productGummies;
  if (texto.includes("vape") || texto.includes("cartucho")) return productVape;
  if (texto.includes("pre-roll") || texto.includes("preroll")) return productPrerolls;
  if (texto.includes("resin") || texto.includes("concentr")) return productResin;
  return productFlower;
}

function Checkout() {
  const navigate = useNavigate();
  const { itens, limparCarrinho } = useCarrinho();

  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("Cascavel");
  const [estado, setEstado] = useState("PR");
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("pix");
  const [observacao, setObservacao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [finalizando, setFinalizando] = useState(false);
  const [pedidoId, setPedidoId] = useState("");

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

  const freteGratis = subtotal >= VALOR_FRETE_GRATIS;

  // Formata o CEP enquanto o usuário digita.
  function alterarCep(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 8);
    setCep(numeros.replace(/^(\d{5})(\d)/, "$1-$2"));
  }

  // Cria o pedido no backend com os dados escolhidos no Checkout.
  async function confirmarPedido(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setMensagem("");

    const token = localStorage.getItem("token");
    const lojaId = itens[0]?.produto.loja?._id;

    if (!token) {
      navigate("/login");
      return;
    }

    if (!lojaId || itens.length === 0) {
      setMensagem("Seu carrinho está vazio ou sem uma loja disponível.");
      return;
    }

    const detalhesEntrega = [
      `${endereco}, ${numero}`,
      complemento,
      bairro,
      `${cidade} - ${estado}`,
      `CEP ${cep}`,
    ]
      .filter(Boolean)
      .join(", ");

    const textoObservacao = [
      `Entrega: ${detalhesEntrega}`,
      `Pagamento: ${nomesPagamento[formaPagamento]}`,
      observacao ? `Observação: ${observacao}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    setFinalizando(true);

    try {
      const resposta = await fetch(`${API_URL}/api/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          loja: lojaId,
          itens: itens.map((item) => ({
            produto: item.produto._id,
            quantidade: item.quantidade,
          })),
          observacao: textoObservacao,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.mensagem || "Não foi possível confirmar o pedido.");
        return;
      }

      setPedidoId(dados._id || dados.pedido?._id || "confirmado");
      limparCarrinho();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setMensagem("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setFinalizando(false);
    }
  }

  if (pedidoId) {
    return (
      <main className="ihemp-checkout-page">
        <Container size="narrow">
          <Card className="checkout-success" padding="large">
            <span className="checkout-success__icon">
              <CheckCircle2 size={38} aria-hidden="true" />
            </span>
            <span>Pedido confirmado</span>
            <h1>Tudo certo!</h1>
            <p>Seu pedido foi enviado para a loja e já aparece no seu histórico.</p>
            {pedidoId !== "confirmado" && (
              <small>Pedido #{pedidoId.slice(-8).toUpperCase()}</small>
            )}
            <div>
              <Link to="/meus-pedidos">Acompanhar pedido</Link>
              <Link to="/">Voltar ao início</Link>
            </div>
          </Card>
        </Container>
      </main>
    );
  }

  if (itens.length === 0) {
    return (
      <main className="ihemp-checkout-page">
        <Container size="narrow">
          <Card className="checkout-empty" variant="soft" padding="large">
            <PackageCheck size={38} aria-hidden="true" />
            <h1>Seu carrinho está vazio</h1>
            <p>Adicione produtos antes de continuar para o Checkout.</p>
            <Link to="/produtos">Explorar produtos</Link>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <main className="ihemp-checkout-page">
      <Container>
        <header className="checkout-header">
          <button type="button" onClick={() => navigate(-1)} aria-label="Voltar">
            <ArrowLeft size={21} aria-hidden="true" />
          </button>
          <div>
            <span>Finalização segura</span>
            <h1>Checkout</h1>
          </div>
          <span className="checkout-header__space" />
        </header>

        <ol className="checkout-steps" aria-label="Etapas da compra">
          <li className="is-complete"><span>1</span> Carrinho</li>
          <li className="is-active"><span>2</span> Entrega</li>
          <li><span>3</span> Confirmação</li>
        </ol>

        <form className="checkout-layout" onSubmit={confirmarPedido}>
          <div className="checkout-main">
            <Card className="checkout-section" padding="large">
              <header>
                <span><MapPin size={22} aria-hidden="true" /></span>
                <div>
                  <h2>Endereço de entrega</h2>
                  <p>Informe onde você deseja receber o pedido.</p>
                </div>
              </header>

              <div className="checkout-fields">
                <label className="checkout-field checkout-field--cep">
                  <span>CEP</span>
                  <input
                    value={cep}
                    onChange={(evento) => alterarCep(evento.target.value)}
                    placeholder="00000-000"
                    inputMode="numeric"
                    pattern="[0-9]{5}-[0-9]{3}"
                    autoComplete="postal-code"
                    required
                  />
                </label>

                <label className="checkout-field checkout-field--wide">
                  <span>Endereço</span>
                  <input
                    value={endereco}
                    onChange={(evento) => setEndereco(evento.target.value)}
                    placeholder="Rua ou avenida"
                    autoComplete="street-address"
                    required
                  />
                </label>

                <label className="checkout-field">
                  <span>Número</span>
                  <input
                    value={numero}
                    onChange={(evento) => setNumero(evento.target.value)}
                    placeholder="123"
                    required
                  />
                </label>

                <label className="checkout-field checkout-field--wide">
                  <span>Complemento</span>
                  <input
                    value={complemento}
                    onChange={(evento) => setComplemento(evento.target.value)}
                    placeholder="Apartamento, bloco ou referência (opcional)"
                  />
                </label>

                <label className="checkout-field checkout-field--wide">
                  <span>Bairro</span>
                  <input
                    value={bairro}
                    onChange={(evento) => setBairro(evento.target.value)}
                    placeholder="Seu bairro"
                    autoComplete="address-level3"
                    required
                  />
                </label>

                <label className="checkout-field checkout-field--wide">
                  <span>Cidade</span>
                  <input
                    value={cidade}
                    onChange={(evento) => setCidade(evento.target.value)}
                    autoComplete="address-level2"
                    required
                  />
                </label>

                <label className="checkout-field">
                  <span>Estado</span>
                  <input
                    value={estado}
                    onChange={(evento) => setEstado(evento.target.value.toUpperCase().slice(0, 2))}
                    maxLength={2}
                    autoComplete="address-level1"
                    required
                  />
                </label>
              </div>
            </Card>

            <Card className="checkout-section" padding="large">
              <header>
                <span><CreditCard size={22} aria-hidden="true" /></span>
                <div>
                  <h2>Forma de pagamento</h2>
                  <p>Escolha como prefere pagar diretamente à loja.</p>
                </div>
              </header>

              <div className="checkout-payment-options">
                <label className={formaPagamento === "pix" ? "is-selected" : ""}>
                  <input
                    type="radio"
                    name="pagamento"
                    value="pix"
                    checked={formaPagamento === "pix"}
                    onChange={() => setFormaPagamento("pix")}
                  />
                  <span><QrCode size={22} aria-hidden="true" /></span>
                  <div><strong>Pix</strong><small>Combine os dados com a loja</small></div>
                </label>

                <label className={formaPagamento === "cartao" ? "is-selected" : ""}>
                  <input
                    type="radio"
                    name="pagamento"
                    value="cartao"
                    checked={formaPagamento === "cartao"}
                    onChange={() => setFormaPagamento("cartao")}
                  />
                  <span><CreditCard size={22} aria-hidden="true" /></span>
                  <div><strong>Cartão</strong><small>Pagamento na entrega</small></div>
                </label>

                <label className={formaPagamento === "dinheiro" ? "is-selected" : ""}>
                  <input
                    type="radio"
                    name="pagamento"
                    value="dinheiro"
                    checked={formaPagamento === "dinheiro"}
                    onChange={() => setFormaPagamento("dinheiro")}
                  />
                  <span><Banknote size={22} aria-hidden="true" /></span>
                  <div><strong>Dinheiro</strong><small>Pagamento na entrega</small></div>
                </label>
              </div>

              <label className="checkout-field checkout-field--observation">
                <span>Observações para a loja</span>
                <textarea
                  value={observacao}
                  onChange={(evento) => setObservacao(evento.target.value)}
                  placeholder="Ex.: instruções para encontrar o endereço (opcional)"
                  rows={3}
                />
              </label>
            </Card>
          </div>

          <aside className="checkout-summary">
            <Card className="checkout-summary__card" padding="large">
              <span>Resumo do pedido</span>
              <div className="checkout-summary__store">
                <Store size={18} aria-hidden="true" />
                <strong>{itens[0].produto.loja?.nome}</strong>
              </div>

              <div className="checkout-summary__items">
                {itens.map((item) => (
                  <div className="checkout-summary__item" key={item.produto._id}>
                    <img
                      src={imagemProduto(item.produto.nome, item.produto.categoria)}
                      alt=""
                    />
                    <div>
                      <strong>{item.produto.nome}</strong>
                      <small>{item.quantidade} × {formatadorPreco.format(item.produto.preco)}</small>
                    </div>
                    <strong>{formatadorPreco.format(item.produto.preco * item.quantidade)}</strong>
                  </div>
                ))}
              </div>

              <dl>
                <div><dt>Itens ({quantidadeTotal})</dt><dd>{formatadorPreco.format(subtotal)}</dd></div>
                <div><dt>Entrega</dt><dd>{freteGratis ? "Grátis" : "A combinar"}</dd></div>
              </dl>

              <div className="checkout-summary__total">
                <span>Total dos produtos</span>
                <strong>{formatadorPreco.format(subtotal)}</strong>
              </div>

              {!freteGratis && (
                <p className="checkout-summary__note">
                  O valor da entrega será confirmado pela loja.
                </p>
              )}

              {mensagem && <p className="checkout-notice" role="alert">{mensagem}</p>}

              <Button type="submit" size="large" fullWidth loading={finalizando}>
                {finalizando ? "Confirmando..." : "Confirmar pedido"}
                {!finalizando && <ChevronRight size={19} aria-hidden="true" />}
              </Button>

              <div className="checkout-summary__safe">
                <ShieldCheck size={18} aria-hidden="true" />
                <span>Pedido protegido e dados seguros</span>
              </div>
            </Card>

            <Card className="checkout-summary__delivery" variant="soft">
              <Truck size={21} aria-hidden="true" />
              <div><strong>Entrega discreta</strong><span>Embalagem segura na sua porta</span></div>
            </Card>
          </aside>
        </form>
      </Container>
    </main>
  );
}

export default Checkout;
