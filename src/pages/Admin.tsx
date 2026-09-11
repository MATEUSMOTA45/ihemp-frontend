import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Boxes,
  Building2,
  CircleDollarSign,
  Clock3,
  LayoutDashboard,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Store,
  UserRoundCog,
  UsersRound,
} from "lucide-react";

import LojaAdmin from "../components/admin/LojaAdmin";
import PedidoAdmin from "../components/admin/PedidoAdmin";
import ProdutoAdmin from "../components/admin/ProdutoAdmin";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import Container from "../components/ui/Container";
import { useAuth } from "../context/AuthContext";
import "../styles/admin.css";
import { fetchComTentativas } from "../utils/fetchComTentativas";

const API_URL = import.meta.env.VITE_API_URL;

type Usuario = {
  _id: string;
  nome: string;
  email: string;
  tipo: string;
  ativo: boolean;
};

type ProdutoResumo = { ativo?: boolean; estoque?: number };
type LojaResumo = { ativa?: boolean };
type PedidoResumo = { status?: string; valorTotal?: number };
type AbaAdmin = "resumo" | "usuarios" | "produtos" | "lojas" | "pedidos";

const abas: { id: AbaAdmin; nome: string }[] = [
  { id: "resumo", nome: "Visão geral" },
  { id: "usuarios", nome: "Usuários" },
  { id: "produtos", nome: "Produtos" },
  { id: "lojas", nome: "Lojas" },
  { id: "pedidos", nome: "Pedidos" },
];

function Admin() {
  const { usuario: administrador } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [produtos, setProdutos] = useState<ProdutoResumo[]>([]);
  const [lojas, setLojas] = useState<LojaResumo[]>([]);
  const [pedidos, setPedidos] = useState<PedidoResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [abaAtiva, setAbaAtiva] = useState<AbaAdmin>("resumo");

  // Busca os dados necessários para os indicadores do painel.
  const carregarDashboard = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setErro("Token não encontrado.");
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const configuracaoAdmin = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const [respostaUsuarios, respostaProdutos, respostaLojas, respostaPedidos] =
        await Promise.all([
          fetchComTentativas(`${API_URL}/api/usuarios`, configuracaoAdmin),
          fetchComTentativas(`${API_URL}/api/produtos`),
          fetchComTentativas(`${API_URL}/api/lojas`),
          fetchComTentativas(`${API_URL}/api/pedidos`, configuracaoAdmin),
        ]);

      if (
        !respostaUsuarios.ok ||
        !respostaProdutos.ok ||
        !respostaLojas.ok ||
        !respostaPedidos.ok
      ) {
        throw new Error("A API não conseguiu carregar todos os dados.");
      }

      const [dadosUsuarios, dadosProdutos, dadosLojas, dadosPedidos] =
        await Promise.all([
          respostaUsuarios.json(),
          respostaProdutos.json(),
          respostaLojas.json(),
          respostaPedidos.json(),
        ]);

      setUsuarios(Array.isArray(dadosUsuarios) ? dadosUsuarios : []);
      setProdutos(Array.isArray(dadosProdutos) ? dadosProdutos : []);
      setLojas(Array.isArray(dadosLojas) ? dadosLojas : []);
      setPedidos(Array.isArray(dadosPedidos) ? dadosPedidos : []);
    } catch {
      setErro("Não foi possível carregar o painel administrativo.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    carregarDashboard();
  }, [carregarDashboard]);

  const resumo = useMemo(() => {
    const pedidosPendentes = pedidos.filter(
      (pedido) => pedido.status === "pendente",
    ).length;
    const pedidosEntregues = pedidos.filter(
      (pedido) => pedido.status === "entregue",
    ).length;
    const faturamento = pedidos
      .filter((pedido) => pedido.status !== "cancelado")
      .reduce((total, pedido) => total + Number(pedido.valorTotal || 0), 0);

    return {
      usuarios: usuarios.length,
      produtos: produtos.length,
      produtosAtivos: produtos.filter((produto) => produto.ativo !== false).length,
      estoqueBaixo: produtos.filter((produto) => Number(produto.estoque || 0) <= 5)
        .length,
      lojas: lojas.length,
      lojasAtivas: lojas.filter((loja) => loja.ativa !== false).length,
      pedidos: pedidos.length,
      pedidosPendentes,
      pedidosEntregues,
      faturamento,
    };
  }, [lojas, pedidos, produtos, usuarios]);

  const moeda = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  async function promoverParaAdmin(id: string) {
    const token = localStorage.getItem("token");

    if (!token) {
      setMensagem("Token não encontrado.");
      return;
    }

    if (!window.confirm("Deseja promover este usuário para administrador?")) {
      return;
    }

    try {
      const resposta = await fetch(`${API_URL}/api/usuarios/${id}/admin`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(dados.mensagem || "Erro ao promover usuário.");
        return;
      }

      setMensagem("Usuário promovido para administrador!");
      await carregarDashboard();
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    }
  }

  return (
    <main className="admin-page">
      <Container size="wide">
        <header className="admin-heading">
          <div>
            <span>Gestão IHEMP</span>
            <h1>Painel administrativo</h1>
            <p>Acompanhe a operação e gerencie os dados do marketplace.</p>
          </div>

          <button
            className="admin-refresh"
            type="button"
            onClick={carregarDashboard}
            disabled={carregando}
          >
            <RefreshCw size={17} aria-hidden="true" />
            {carregando ? "Atualizando..." : "Atualizar dados"}
          </button>
        </header>

        {erro && !carregando ? (
          <Card className="admin-error" variant="soft" padding="large">
            <ShieldCheck size={34} aria-hidden="true" />
            <h2>Não foi possível abrir o painel</h2>
            <p>{erro}</p>
            <button type="button" onClick={carregarDashboard}>
              Tentar novamente
            </button>
          </Card>
        ) : (
          <>
            <section className="admin-hero">
              <div>
                <span className="admin-hero__eyebrow">
                  <LayoutDashboard size={17} aria-hidden="true" />
                  Central de operações
                </span>
                <h2>Olá, {administrador?.nome?.split(" ")[0] || "Administrador"}</h2>
                <p>
                  Veja o movimento do IHEMP e acesse rapidamente cada área de
                  gerenciamento.
                </p>
              </div>

              <div className="admin-hero__signal">
                <span><Clock3 size={18} aria-hidden="true" /></span>
                <div>
                  <small>Precisam de atenção</small>
                  <strong>{resumo.pedidosPendentes} pedidos pendentes</strong>
                </div>
              </div>
            </section>

            <section className="admin-stats" aria-label="Resumo administrativo">
              <Card variant="outlined" padding="medium">
                <span><UsersRound size={22} aria-hidden="true" /></span>
                <div><strong>{resumo.usuarios}</strong><small>Usuários</small></div>
              </Card>
              <Card variant="outlined" padding="medium">
                <span><Boxes size={22} aria-hidden="true" /></span>
                <div><strong>{resumo.produtos}</strong><small>Produtos</small></div>
              </Card>
              <Card variant="outlined" padding="medium">
                <span><Store size={22} aria-hidden="true" /></span>
                <div><strong>{resumo.lojas}</strong><small>Lojas</small></div>
              </Card>
              <Card variant="outlined" padding="medium">
                <span><PackageCheck size={22} aria-hidden="true" /></span>
                <div><strong>{resumo.pedidos}</strong><small>Pedidos</small></div>
              </Card>
            </section>

            <div className="admin-tabs" role="tablist" aria-label="Áreas administrativas">
              {abas.map((aba) => (
                <button
                  key={aba.id}
                  className={abaAtiva === aba.id ? "ativo" : ""}
                  type="button"
                  role="tab"
                  aria-selected={abaAtiva === aba.id}
                  onClick={() => {
                    setMensagem("");
                    setAbaAtiva(aba.id);
                  }}
                >
                  {aba.nome}
                </button>
              ))}
            </div>

            {mensagem && (
              <p className="admin-notice" aria-live="polite">{mensagem}</p>
            )}

            {abaAtiva === "resumo" && (
              <section className="admin-overview">
                <Card className="admin-overview__card" variant="outlined" padding="large">
                  <div className="admin-card-heading">
                    <span><CircleDollarSign size={21} aria-hidden="true" /></span>
                    <div>
                      <h2>Resumo da operação</h2>
                      <p>Indicadores calculados com os dados atuais da API.</p>
                    </div>
                  </div>

                  <dl className="admin-operation-list">
                    <div><dt>Volume de pedidos</dt><dd>{resumo.pedidos}</dd></div>
                    <div><dt>Pedidos entregues</dt><dd>{resumo.pedidosEntregues}</dd></div>
                    <div><dt>Valor movimentado</dt><dd>{moeda.format(resumo.faturamento)}</dd></div>
                    <div><dt>Produtos com estoque baixo</dt><dd>{resumo.estoqueBaixo}</dd></div>
                  </dl>
                </Card>

                <Card className="admin-overview__card" variant="outlined" padding="large">
                  <div className="admin-card-heading">
                    <span><ShoppingBag size={21} aria-hidden="true" /></span>
                    <div>
                      <h2>Ações rápidas</h2>
                      <p>Acesse diretamente o que deseja gerenciar.</p>
                    </div>
                  </div>

                  <div className="admin-quick-actions">
                    <button type="button" onClick={() => setAbaAtiva("pedidos")}>
                      <span><PackageCheck size={20} aria-hidden="true" /></span>
                      <div><strong>Ver pedidos</strong><small>{resumo.pedidosPendentes} aguardando análise</small></div>
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => setAbaAtiva("produtos")}>
                      <span><Boxes size={20} aria-hidden="true" /></span>
                      <div><strong>Gerenciar produtos</strong><small>{resumo.produtosAtivos} produtos ativos</small></div>
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => setAbaAtiva("lojas")}>
                      <span><Building2 size={20} aria-hidden="true" /></span>
                      <div><strong>Gerenciar lojas</strong><small>{resumo.lojasAtivas} lojas ativas</small></div>
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                </Card>
              </section>
            )}

            {abaAtiva === "usuarios" && (
              <section className="admin-users">
                <div className="admin-section-heading">
                  <div>
                    <span><UserRoundCog size={21} aria-hidden="true" /></span>
                    <div><h2>Usuários cadastrados</h2><p>Contas que possuem acesso ao IHEMP.</p></div>
                  </div>
                  <Badge variant="success" size="medium">{usuarios.length} usuários</Badge>
                </div>

                <div className="admin-users__list">
                  {usuarios.map((usuario) => (
                    <Card key={usuario._id} className="admin-user-card" variant="outlined" padding="medium">
                      <span className="admin-user-card__avatar" aria-hidden="true">
                        {usuario.nome.charAt(0).toUpperCase()}
                      </span>
                      <div className="admin-user-card__identity">
                        <strong>{usuario.nome}</strong>
                        <small>{usuario.email}</small>
                      </div>
                      <Badge variant={usuario.ativo ? "success" : "danger"}>
                        {usuario.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                      <Badge variant={usuario.tipo === "admin" ? "brand" : "neutral"}>
                        {usuario.tipo === "admin" ? "Administrador" : "Cliente"}
                      </Badge>
                      {usuario.tipo !== "admin" && (
                        <button type="button" onClick={() => promoverParaAdmin(usuario._id)}>
                          Tornar administrador
                        </button>
                      )}
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {abaAtiva === "produtos" && <div className="admin-module"><ProdutoAdmin /></div>}
            {abaAtiva === "lojas" && <div className="admin-module"><LojaAdmin /></div>}
            {abaAtiva === "pedidos" && <div className="admin-module"><PedidoAdmin /></div>}
          </>
        )}
      </Container>
    </main>
  );
}

export default Admin;