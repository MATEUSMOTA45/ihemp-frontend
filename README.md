# IHEMP Frontend

Frontend web do **IHEMP**, uma aplicação full stack inspirada em plataformas de delivery.

O projeto foi desenvolvido com **React, TypeScript e Vite** e consome uma API própria construída com **Node.js, Express e MongoDB**.

## Demo

Frontend publicado na Vercel:

**[Acessar aplicação](COLE_AQUI_O_LINK_DA_VERCEL)**

Backend:

**[Repositório do backend](https://github.com/MATEUSMOTA45/ihemp-backend)**

## Sobre o projeto

O IHEMP foi desenvolvido com o objetivo de praticar e demonstrar conhecimentos de desenvolvimento Full Stack.

A aplicação possui autenticação, gerenciamento de usuários, produtos, lojas, pedidos, carrinho de compras e área administrativa.

O frontend se comunica com uma API REST própria e utiliza JWT para autenticação e proteção de rotas.

## Tecnologias

### Frontend

- React
- TypeScript
- Vite
- React Router
- Context API
- Fetch API
- CSS

### Integração e autenticação

- API REST
- JWT
- LocalStorage
- Variáveis de ambiente com Vite

### Desenvolvimento e deploy

- Git
- GitHub
- Vercel
- Render

## Funcionalidades

### Usuário

- Cadastro de conta
- Login
- Autenticação com JWT
- Perfil protegido
- Logout
- Listagem de produtos
- Carrinho de compras
- Validação de produtos por loja
- Validação de estoque
- Finalização de pedidos
- Consulta dos próprios pedidos

### Área administrativa

- Listagem de usuários
- Promoção de usuário para administrador
- Cadastro de produtos
- Edição de produtos
- Exclusão de produtos
- Cadastro de lojas
- Edição de lojas
- Exclusão de lojas
- Visualização de pedidos
- Atualização do status dos pedidos
- Exclusão de pedidos

## Arquitetura do frontend

O projeto foi organizado separando responsabilidades em páginas, componentes e contextos.

```text
src/
├── assets/
│
├── components/
│   ├── admin/
│   │   ├── LojaAdmin.tsx
│   │   ├── PedidoAdmin.tsx
│   │   └── ProdutoAdmin.tsx
│   │
│   ├── Navbar.tsx
│   ├── RotaAdmin.tsx
│   └── RotaProtegida.tsx
│
├── context/
│   ├── AuthContext.tsx
│   └── CarrinhoContext.tsx
│
├── pages/
│   ├── Admin.tsx
│   ├── Cadastro.tsx
│   ├── Carrinho.tsx
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── MeusPedidos.tsx
│   ├── Perfil.tsx
│   └── Produtos.tsx
│
├── App.tsx
├── index.css
└── main.tsx