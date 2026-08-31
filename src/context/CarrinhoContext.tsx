import {
  createContext,
  useContext,
  useState,
} from "react";

import type { ReactNode } from "react";

// Loja do produto
type Loja = {
  _id: string;
  nome: string;
};

// Produto do carrinho
type Produto = {
  _id: string;
  nome: string;
  preco: number;
  estoque: number;
  loja: Loja | null;
};

// Item do carrinho
type ItemCarrinho = {
  produto: Produto;
  quantidade: number;
};

// Tipo do contexto
type CarrinhoContextType = {
  itens: ItemCarrinho[];
  adicionarProduto: (produto: Produto) => string | null;
  removerProduto: (id: string) => void;
  limparCarrinho: () => void;
};

// Cria o contexto do carrinho
const CarrinhoContext =
  createContext<CarrinhoContextType | undefined>(undefined);

// Tipo das propriedades do provider
type CarrinhoProviderProps = {
  children: ReactNode;
};

export function CarrinhoProvider({
  children,
}: CarrinhoProviderProps) {
  // Itens atuais do carrinho
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  // Adiciona produto ao carrinho
  function adicionarProduto(
    produto: Produto
  ): string | null {
    // Verifica se o produto possui loja
    if (!produto.loja) {
      return "Este produto não possui uma loja disponível.";
    }

    // Verifica a loja do primeiro item
    const lojaAtual = itens[0]?.produto.loja?._id;

    // Bloqueia produtos de outra loja
    if (
      lojaAtual &&
      lojaAtual !== produto.loja._id
    ) {
      return "Seu carrinho já possui produtos de outra loja.";
    }

    // Procura o produto no carrinho
    const itemExistente = itens.find(
      (item) => item.produto._id === produto._id
    );

    // Verifica o limite de estoque
    if (
      itemExistente &&
      itemExistente.quantidade >= produto.estoque
    ) {
      return "Quantidade máxima em estoque atingida.";
    }

    // Atualiza os itens do carrinho
    setItens((itensAtuais) => {
      const item = itensAtuais.find(
        (item) => item.produto._id === produto._id
      );

      // Aumenta quantidade se já existir
      if (item) {
        return itensAtuais.map((itemAtual) =>
          itemAtual.produto._id === produto._id
            ? {
                ...itemAtual,
                quantidade: itemAtual.quantidade + 1,
              }
            : itemAtual
        );
      }

      // Adiciona novo produto
      return [
        ...itensAtuais,
        {
          produto,
          quantidade: 1,
        },
      ];
    });

    return null;
  }

  // Remove produto do carrinho
  function removerProduto(id: string) {
    setItens((itensAtuais) =>
      itensAtuais.filter(
        (item) => item.produto._id !== id
      )
    );
  }

  // Limpa todo o carrinho
  function limparCarrinho() {
    setItens([]);
  }

  // Disponibiliza o carrinho para a aplicação
  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionarProduto,
        removerProduto,
        limparCarrinho,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

// Facilita o uso do carrinho
export function useCarrinho() {
  const contexto = useContext(CarrinhoContext);

  // Evita usar o contexto fora do provider
  if (!contexto) {
    throw new Error(
      "useCarrinho deve ser usado dentro de CarrinhoProvider"
    );
  }

  return contexto;
}