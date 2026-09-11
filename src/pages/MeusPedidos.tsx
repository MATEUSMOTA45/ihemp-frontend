import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

import productFlower from "../assets/products/product-flower.webp";
import productGummies from "../assets/products/product-gummies.webp";
import productPrerolls from "../assets/products/product-prerolls.webp";
import productResin from "../assets/products/product-resin.webp";
import productVape from "../assets/products/product-vape.webp";
import Card from "../components/ui/Card";
import Container from "../components/ui/Container";
import "../styles/pedidos.css";

const API_URL = import.meta.env.VITE_API_URL;

type ProdutoPedido = {
  _id: string;
  nome: string;
  categoria?: string;
};

type ItemPedido = {
  produto: ProdutoPedido | null;
  quantidade: number;
  precoUnitario: number;
};

type LojaPedido = {
  _id: string;
  nome: string;
};

type Pedido = {
  _id: string;
  loja: LojaPedido | null;
  itens: ItemPedido[];
  valorTotal: number;
  status: string;
  observacao?: string;
  createdAt: string;
};

type DetalhesPedido = {
  entrega: string;
  pagamento: string;
  observacao: string;
};

const formatadorPreco = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const formatadorData = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const statusPedido: Record<string, { texto: string; classe: string }> = {
  pendente: { texto: "Aguardando confirmação", classe: "is-pending" },
  confirmado: { texto: "Pedido confirmado", classe: "is-confirmed" },
  preparando: { texto: "Em preparação", classe: "is-preparing" },
  em_preparo: { texto: "Em preparação", classe: "is-preparing" },
  pronto: { texto: "Pronto para entrega", classe: "is-ready" },
  em_rota: { texto: "Saiu para entrega", classe: "is-route" },
  entregue: { texto: "Pedido entregue", classe: "is-delivered" },
  cancelado: { texto: "Pedido cancelado", classe: "is-cancelled" },
};

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

// Separa os dados enviados pelo Checkout.
function separarObservacao(texto = ""): DetalhesPedido {
  const detalhes: DetalhesPedido = {
    entrega: "Endereço não informado",
    pagamento: "A combinar com a loja",
    observacao: "",
  };

  const partes = texto.split("|").map((parte) => parte.trim()).filter(Boolean);

  partes.forEach((parte) => {
    if (parte.startsWith("Entrega:")) {
      detalhes.entrega = parte.replace("Entrega:", "").trim();
    } else if (parte.startsWith("Pagamento:")) {
      detalhes.pagamento = parte.replace("Pagamento:", "").trim();
    } else if (parte.startsWith("Observação:")) {
      detalhes.observacao = parte.replace("Observação:", "").trim();
    } else {
      detalhes.observacao = parte;
    }
  });

  return detalhes;
}

function MeusPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  // Busca os pedidos do usuário autenticado.
  const carregarPedidos = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMensagem("Você precisa fazer login para visualizar seus pedidos.");
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      const resposta = await fetch(`${API_URL}/api/pedidos/meus`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.mensagem || "Não foi possível carregar seus pedidos.");
        return;
      }

      const lista: Pedido[] = Array.isArray(dados) ? dados : [];
      setPedidos(
        [...lista].sort(
          (primeiro, segundo) =>
            new Date(segundo.createdAt).getTime() - new Date(primeiro.createdAt).getTime(),
        ),
      );
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    carregarPedidos();
  }, [carregarPedidos]);

  return (
    <main className="ihemp-orders-page">
      <Container>
        <header className="orders-heading">
          <div>
            <span>Seu histórico</span>
            <h1>Meus pedidos</h1>
            <p>Acompanhe seus pedidos e consulte os detalhes de cada compra.</p>
          </div>

          {!carregando && pedidos.length > 0 && (
            <button type="button" onClick={carregarPedidos}>
              <RefreshCw size={17} aria-hidden="true" />
              Atualizar
            </button>
          )}
        </header>

        {carregando ? (
          <div className="orders-loading" aria-live="polite">
            <span />
            <span />
            <span />
            <p>Carregando seus pedidos...</p>
          </div>
        ) : mensagem ? (
          <Card className="orders-state" variant="soft" padding="large">
            <AlertCircle size={36} aria-hidden="true" />
            <h2>Não foi possível carregar</h2>
            <p>{mensagem}</p>
            <button type="button" onClick={carregarPedidos}>Tentar novamente</button>
          </Card>
        ) : pedidos.length === 0 ? (
          <Card className="orders-state" variant="soft" padding="large">
            <ShoppingBag size={36} aria-hidden="true" />
            <h2>Você ainda não fez pedidos</h2>
            <p>Explore o catálogo e encontre seus produtos favoritos.</p>
            <Link to="/produtos">Explorar produtos</Link>
          </Card>
        ) : (
          <section className="orders-list" aria-label="Histórico de pedidos">
            {pedidos.map((pedido) => {
              const status = statusPedido[pedido.status.toLowerCase()] || {
                texto: pedido.status,
                classe: "is-pending",
              };
              const detalhes = separarObservacao(pedido.observacao);
              const quantidadeTotal = pedido.itens.reduce(
                (total, item) => total + item.quantidade,
                0,
              );

              return (
                <Card className="order-card" padding="none" key={pedido._id}>
                  <header className="order-card__header">
                    <div>
                      <span className="order-card__icon">
                        <ReceiptText size={21} aria-hidden="true" />
                      </span>
                      <div>
                        <small>Pedido</small>
                        <h2>#{pedido._id.slice(-8).toUpperCase()}</h2>
                      </div>
                    </div>

                    <span className={`order-status ${status.classe}`}>
                      {pedido.status.toLowerCase() === "entregue" ? (
                        <CheckCircle2 size={16} aria-hidden="true" />
                      ) : (
                        <Clock3 size={16} aria-hidden="true" />
                      )}
                      {status.texto}
                    </span>
                  </header>

                  <div className="order-card__body">
                    <div className="order-card__content">
                      <div className="order-card__meta">
                        <span><Store size={17} aria-hidden="true" /> {pedido.loja?.nome || "Loja não disponível"}</span>
                        <span><CalendarDays size={17} aria-hidden="true" /> {formatadorData.format(new Date(pedido.createdAt))}</span>
                      </div>

                      <div className="order-products">
                        {pedido.itens.map((item, indice) => (
                          <div className="order-product" key={`${pedido._id}-${item.produto?._id || indice}`}>
                            <img
                              src={imagemProduto(item.produto?.nome || "", item.produto?.categoria)}
                              alt=""
                            />
                            <div>
                              <strong>{item.produto?.nome || "Produto não disponível"}</strong>
                              <small>{item.quantidade} × {formatadorPreco.format(item.precoUnitario)}</small>
                            </div>
                            <strong>{formatadorPreco.format(item.quantidade * item.precoUnitario)}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <aside className="order-card__summary">
                      <div>
                        <span>{quantidadeTotal} {quantidadeTotal === 1 ? "item" : "itens"}</span>
                        <strong>{formatadorPreco.format(pedido.valorTotal)}</strong>
                      </div>
                      <small>Total do pedido</small>
                    </aside>
                  </div>

                  <footer className="order-details">
                    <div>
                      <MapPin size={18} aria-hidden="true" />
                      <span><small>Entrega</small><strong>{detalhes.entrega}</strong></span>
                    </div>
                    <div>
                      <CreditCard size={18} aria-hidden="true" />
                      <span><small>Pagamento</small><strong>{detalhes.pagamento}</strong></span>
                    </div>
                    {detalhes.observacao && (
                      <div>
                        <PackageCheck size={18} aria-hidden="true" />
                        <span><small>Observação</small><strong>{detalhes.observacao}</strong></span>
                      </div>
                    )}
                  </footer>

                  <div className="order-card__help">
                    <Truck size={17} aria-hidden="true" />
                    <span>A loja atualizará o status conforme o pedido avançar.</span>
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

export default MeusPedidos;
