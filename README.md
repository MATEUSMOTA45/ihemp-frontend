# IHEMP Frontend

Frontend web do projeto **IHEMP**, desenvolvido com React, TypeScript e Vite.

O projeto consome uma API própria desenvolvida em Node.js com Express e MongoDB.

## Sobre o projeto

O IHEMP é uma aplicação web inspirada em plataformas de delivery, com foco em cadastro de usuários, produtos, lojas, pedidos, autenticação e área administrativa.

O objetivo do projeto é praticar e demonstrar conhecimentos de desenvolvimento Full Stack, integração entre frontend e backend, autenticação com JWT, consumo de API REST e organização de código.

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- React Router
- Context API
- Fetch API
- JWT
- CSS
- Git
- GitHub

## Funcionalidades

### Usuário

- Cadastro de usuário
- Login
- Autenticação com JWT
- Perfil protegido
- Logout
- Visualização de produtos
- Carrinho de compras
- Validação de produtos por loja
- Finalização de pedidos
- Visualização dos próprios pedidos

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
- Atualização de status dos pedidos
- Exclusão de pedidos

## Estrutura do projeto

```text
src/
├── assets/
├── components/
│   ├── admin/
│   │   ├── LojaAdmin.tsx
│   │   ├── PedidoAdmin.tsx
│   │   └── ProdutoAdmin.tsx
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