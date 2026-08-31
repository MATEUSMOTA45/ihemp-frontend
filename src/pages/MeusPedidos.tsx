import { useEffect, useState } from "react";

// URL base da API vinda do arquivo .env
const API_URL = import.meta.env.VITE_API_URL;

// Produto dentro do pedido
type ProdutoPedido = {
  _id: string;
  nome: string;
};

// Item do pedido
type ItemPedido = {
  produto: ProdutoPedido;
  quantidade: number;
  precoUnitario: number;
};

// Loja do pedido
type LojaPedido = {
  _id: string;
  nome: string;
};

// Tipo de pedido
type Pedido = {
  _id: string;
  loja: LojaPedido;
  itens: ItemPedido[];
  valorTotal: number;
  status: string;
  observacao?: string;
  createdAt: string;
};

function MeusPedidos() {
  // Lista de pedidos do usuário
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  // Controle da tela
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  // Busca os pedidos do usuário logado
  async function carregarPedidos() {
    const token = localStorage.getItem("token");

    // Verifica se existe token salvo
    if (!token) {
      setMensagem("Você precisa fazer login.");
      setCarregando(false);
      return;
    }

    try {
      // Busca somente os pedidos do usuário autenticado
      const resposta = await fetch(
        `${API_URL}/api/pedidos/meus`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Converte a resposta para JSON
      const dados = await resposta.json();

      // Verifica se a API respondeu com erro
      if (!resposta.ok) {
        setMensagem(
          dados.mensagem || "Erro ao carregar pedidos."
        );
        return;
      }

      // Salva os pedidos no estado
      setPedidos(dados);
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  // Carrega pedidos ao abrir a página
  useEffect(() => {
    carregarPedidos();
  }, []);

  // Mostra enquanto os pedidos estão sendo carregados
  if (carregando) {
    return (
      <main>
        <h1>Meus Pedidos</h1>
        <p>Carregando pedidos...</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Meus Pedidos</h1>

      {/* Mostra mensagem de erro ou informação */}
      {mensagem && <p>{mensagem}</p>}

      {/* Caso não existam pedidos */}
      {pedidos.length === 0 ? (
        <p>Você ainda não possui pedidos.</p>
      ) : (
        pedidos.map((pedido) => (
          <div key={pedido._id}>
            <h2>Pedido #{pedido._id}</h2>

            <p>
              Loja:{" "}
              {pedido.loja?.nome || "Loja não disponível"}
            </p>

            <p>
              Status: <strong>{pedido.status}</strong>
            </p>

            <p>
              Total: R$ {pedido.valorTotal.toFixed(2)}
            </p>

            <p>
              Data:{" "}
              {new Date(
                pedido.createdAt
              ).toLocaleString("pt-BR")}
            </p>

            {/* Itens do pedido */}
            <h3>Itens</h3>

            {pedido.itens.map((item, index) => (
              <div key={index}>
                <p>
                  Produto:{" "}
                  {item.produto?.nome ||
                    "Produto não disponível"}
                </p>

                <p>
                  Quantidade: {item.quantidade}
                </p>

                <p>
                  Preço unitário: R${" "}
                  {item.precoUnitario.toFixed(2)}
                </p>
              </div>
            ))}

            {/* Observação opcional */}
            {pedido.observacao && (
              <p>
                Observação: {pedido.observacao}
              </p>
            )}

            <hr />
          </div>
        ))
      )}
    </main>
  );
}

export default MeusPedidos;