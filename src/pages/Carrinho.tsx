import { useState } from "react";
import { useCarrinho } from "../context/CarrinhoContext";

// URL base da API vinda do arquivo .env
const API_URL = import.meta.env.VITE_API_URL;

// Tipo usado para mensagem da tela
type Mensagem = {
  texto: string;
};

function Carrinho() {
  // Dados e funções do carrinho
  const {
    itens,
    removerProduto,
    limparCarrinho,
  } = useCarrinho();

  // Controle da tela
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);
  const [finalizando, setFinalizando] = useState(false);

  // Calcula o total do carrinho
  const valorTotal = itens.reduce(
    (total, item) =>
      total + item.produto.preco * item.quantidade,
    0
  );

  // Finaliza o pedido
  async function finalizarPedido() {
    const token = localStorage.getItem("token");

    // Verifica se o usuário está logado
    if (!token) {
      setMensagem({
        texto: "Você precisa fazer login para finalizar o pedido.",
      });
      return;
    }

    // Verifica se existem itens no carrinho
    if (itens.length === 0) {
      setMensagem({
        texto: "Seu carrinho está vazio.",
      });
      return;
    }

    // Todos os produtos precisam ser da mesma loja
    const primeiraLoja = itens[0].produto.loja?._id;

    if (!primeiraLoja) {
      setMensagem({
        texto: "Loja do produto não encontrada.",
      });
      return;
    }

    // Verifica se existe produto de outra loja
    const lojasDiferentes = itens.some(
      (item) =>
        item.produto.loja?._id !== primeiraLoja
    );

    if (lojasDiferentes) {
      setMensagem({
        texto:
          "Os produtos do pedido precisam pertencer à mesma loja.",
      });
      return;
    }

    // Ativa o estado de carregamento
    setFinalizando(true);
    setMensagem(null);

    try {
      // Envia o pedido para a API
      const resposta = await fetch(
        `${API_URL}/api/pedidos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            loja: primeiraLoja,

            // Envia produto e quantidade
            itens: itens.map((item) => ({
              produto: item.produto._id,
              quantidade: item.quantidade,
            })),
          }),
        }
      );

      // Converte a resposta para JSON
      const dados = await resposta.json();

      // Verifica se ocorreu algum erro na API
      if (!resposta.ok) {
        setMensagem({
          texto:
            dados.mensagem ||
            "Não foi possível criar o pedido.",
        });
        return;
      }

      // Limpa o carrinho após sucesso
      limparCarrinho();

      // Mostra mensagem de sucesso
      setMensagem({
        texto: "Pedido realizado com sucesso!",
      });
    } catch {
      // Erro de conexão com o servidor
      setMensagem({
        texto: "Não foi possível conectar ao servidor.",
      });
    } finally {
      // Finaliza o estado de carregamento
      setFinalizando(false);
    }
  }

  return (
    <main>
      <h1>Carrinho</h1>

      {/* Mostra mensagem */}
      {mensagem && <p>{mensagem.texto}</p>}

      {/* Carrinho vazio */}
      {itens.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          {/* Lista os itens */}
          {itens.map((item) => (
            <div key={item.produto._id}>
              <h2>{item.produto.nome}</h2>

              <p>
                Loja:{" "}
                {item.produto.loja?.nome ||
                  "Loja não disponível"}
              </p>

              <p>
                Quantidade: {item.quantidade}
              </p>

              <p>
                Preço unitário: R${" "}
                {item.produto.preco.toFixed(2)}
              </p>

              <p>
                Subtotal: R${" "}
                {(
                  item.produto.preco *
                  item.quantidade
                ).toFixed(2)}
              </p>

              {/* Remove o produto */}
              <button
                onClick={() =>
                  removerProduto(item.produto._id)
                }
              >
                Remover
              </button>

              <hr />
            </div>
          ))}

          {/* Mostra o valor total */}
          <h2>
            Total: R$ {valorTotal.toFixed(2)}
          </h2>

          {/* Finaliza o pedido */}
          <button
            onClick={finalizarPedido}
            disabled={finalizando}
          >
            {finalizando
              ? "Finalizando..."
              : "Finalizar pedido"}
          </button>

          {" "}

          {/* Limpa todo o carrinho */}
          <button onClick={limparCarrinho}>
            Limpar carrinho
          </button>
        </>
      )}
    </main>
  );
}

export default Carrinho;