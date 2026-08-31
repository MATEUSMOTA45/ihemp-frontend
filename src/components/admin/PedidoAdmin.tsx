import { useEffect, useState } from "react";

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

// Usuário do pedido
type UsuarioPedido = {
  _id: string;
  nome: string;
  email: string;
};

// Loja do pedido
type LojaPedido = {
  _id: string;
  nome: string;
};

// Tipo de pedido
type Pedido = {
  _id: string;
  usuario: UsuarioPedido;
  loja: LojaPedido;
  itens: ItemPedido[];
  valorTotal: number;
  status: string;
  observacao?: string;
  createdAt: string;
};

function PedidoAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");

  async function carregarPedidos() {
    const token = localStorage.getItem("token");

    if (!token) {
      setMensagem("Token não encontrado.");
      setCarregando(false);
      return;
    }

    try {
      const resposta = await fetch(
        `${API_URL}/api/pedidos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem || "Erro ao carregar pedidos."
        );
        return;
      }

      setPedidos(dados);
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }

  async function atualizarStatus(
    id: string,
    novoStatus: string
  ) {
    const token = localStorage.getItem("token");

    if (!token) {
      setMensagem("Token não encontrado.");
      return;
    }

    try {
      const resposta = await fetch(
        `${API_URL}/api/pedidos/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: novoStatus,
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem || "Erro ao atualizar status."
        );
        return;
      }

      setPedidos((pedidosAtuais) =>
        pedidosAtuais.map((pedido) =>
          pedido._id === id
            ? { ...pedido, status: novoStatus }
            : pedido
        )
      );

      setMensagem("Status atualizado com sucesso!");
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    }
  }

  async function excluirPedido(id: string) {
    const token = localStorage.getItem("token");

    if (!token) {
      setMensagem("Token não encontrado.");
      return;
    }

    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este pedido?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(
        `${API_URL}/api/pedidos/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setMensagem(
          dados.mensagem || "Erro ao excluir pedido."
        );
        return;
      }

      setPedidos((pedidosAtuais) =>
        pedidosAtuais.filter(
          (pedido) => pedido._id !== id
        )
      );

      setMensagem("Pedido excluído com sucesso!");
    } catch {
      setMensagem("Não foi possível conectar ao servidor.");
    }
  }

  useEffect(() => {
    carregarPedidos();
  }, []);

  if (carregando) {
    return <p>Carregando pedidos...</p>;
  }

  return (
    <section>
      <h2>Pedidos</h2>

      {mensagem && <p>{mensagem}</p>}

      {pedidos.length === 0 ? (
        <p>Nenhum pedido encontrado.</p>
      ) : (
        pedidos.map((pedido) => (
          <div
            key={pedido._id}
            className="admin-card"
          >
            <h3>Pedido #{pedido._id}</h3>

            <p>
              <strong>Cliente:</strong>{" "}
              {pedido.usuario?.nome}
            </p>

            <p>
              <strong>E-mail:</strong>{" "}
              {pedido.usuario?.email}
            </p>

            <p>
              <strong>Loja:</strong>{" "}
              {pedido.loja?.nome}
            </p>

            <p>
              <strong>Valor total:</strong>{" "}
              R$ {pedido.valorTotal.toFixed(2)}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`status-badge ${pedido.status}`}
              >
                {pedido.status}
              </span>
            </p>

            <p>
              <strong>Data:</strong>{" "}
              {new Date(
                pedido.createdAt
              ).toLocaleString("pt-BR")}
            </p>

            {pedido.observacao && (
              <p>
                <strong>Observação:</strong>{" "}
                {pedido.observacao}
              </p>
            )}

            <div className="pedido-itens">
              <h4>Itens</h4>

              {pedido.itens.map((item, index) => (
                <div
                  key={index}
                  className="pedido-item"
                >
                  <p>
                    <strong>Produto:</strong>{" "}
                    {item.produto?.nome}
                  </p>

                  <p>
                    <strong>Quantidade:</strong>{" "}
                    {item.quantidade}
                  </p>

                  <p>
                    <strong>Preço unitário:</strong>{" "}
                    R$ {item.precoUnitario.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="pedido-acoes">
              <label htmlFor={`status-${pedido._id}`}>
                Status do pedido
              </label>

              <select
                id={`status-${pedido._id}`}
                value={pedido.status}
                onChange={(evento) =>
                  atualizarStatus(
                    pedido._id,
                    evento.target.value
                  )
                }
              >
                <option value="pendente">
                  Pendente
                </option>

                <option value="confirmado">
                  Confirmado
                </option>

                <option value="preparando">
                  Preparando
                </option>

                <option value="enviado">
                  Enviado
                </option>

                <option value="entregue">
                  Entregue
                </option>

                <option value="cancelado">
                  Cancelado
                </option>
              </select>

              <button
                className="admin-button danger"
                onClick={() =>
                  excluirPedido(pedido._id)
                }
              >
                Excluir pedido
              </button>
            </div>
          </div>
        ))
      )}
    </section>
  );
}

export default PedidoAdmin;