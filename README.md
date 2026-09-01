# IHEMP Frontend

<p align="center">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=000000" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Language-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React%20Router-Routing-CA4245?logo=reactrouter&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white" alt="Vercel" />
</p>

Frontend web do projeto **IHEMP**, uma aplicação Full Stack inspirada em plataformas de delivery.

O projeto foi desenvolvido com **React, TypeScript e Vite** e consome uma API própria desenvolvida com **Node.js, Express e MongoDB**.

---

## Links do projeto

### Aplicação online

Frontend publicado na Vercel:

**[Acessar IHEMP](https://ihemp-frontend.vercel.app)**

### Frontend

Repositório:

**[ihemp-frontend](https://github.com/MATEUSMOTA45/ihemp-frontend)**

### Backend

Repositório:

**[ihemp-backend](https://github.com/MATEUSMOTA45/ihemp-backend)**

API publicada no Render:

**[https://ihemp-backend-docker.onrender.com](https://ihemp-backend-docker.onrender.com)**

---

## Sobre o projeto

O **IHEMP** foi desenvolvido com o objetivo de praticar e demonstrar conhecimentos de desenvolvimento Full Stack.

A aplicação possui autenticação, gerenciamento de usuários, produtos, lojas, pedidos, carrinho de compras e área administrativa.

O frontend se comunica com uma API REST própria e utiliza JWT para autenticação e proteção de rotas.

O projeto também utiliza variáveis de ambiente para configuração da API e possui deploy integrado ao GitHub através da Vercel.

---

## Tecnologias utilizadas

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
- JSON Web Token (JWT)
- LocalStorage
- Variáveis de ambiente com Vite

### Desenvolvimento

- Git
- GitHub
- Visual Studio Code

### Deploy

- Vercel
- Render

---

## Funcionalidades

### Usuário

- Cadastro de conta
- Login
- Logout
- Autenticação com JWT
- Perfil protegido
- Navegação dinâmica conforme autenticação
- Listagem de produtos
- Carrinho de compras
- Validação de produtos por loja
- Validação de estoque
- Finalização de pedidos
- Consulta dos próprios pedidos

### Carrinho

- Adição de produtos
- Remoção de produtos
- Limpeza do carrinho
- Cálculo do valor total
- Controle de quantidade
- Validação de estoque
- Bloqueio de produtos de lojas diferentes no mesmo pedido

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

---

## Arquitetura do frontend

O projeto foi organizado separando responsabilidades em componentes, páginas e contextos.

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
Organização da aplicação
Pages

As páginas representam as principais telas da aplicação.

Entre elas:

Home
Login
Cadastro
Produtos
Carrinho
Perfil
Meus Pedidos
Área Administrativa
Components

Os componentes são utilizados para separar partes reutilizáveis da interface e funcionalidades específicas.

Exemplos:

Navbar
Proteção de rotas
Proteção de rotas administrativas
Gerenciamento administrativo de produtos
Gerenciamento administrativo de lojas
Gerenciamento administrativo de pedidos
Context API

O projeto utiliza Context API para compartilhar estados globais.

AuthContext

Responsável por:

estado de autenticação;
informações do usuário;
login;
logout;
carregamento do perfil autenticado.
CarrinhoContext

Responsável por:

produtos adicionados;
quantidades;
remoção de produtos;
limpeza do carrinho;
validação de loja;
validação de estoque.
Autenticação

Após o login, o backend retorna um token JWT.

O token é armazenado no localStorage:

localStorage.setItem("token", token);

Nas requisições protegidas, ele é enviado através do cabeçalho:

Authorization: `Bearer ${token}`

O estado global de autenticação é gerenciado pelo AuthContext.

A Navbar utiliza esse contexto para alterar os links exibidos conforme o usuário esteja autenticado ou não.

Usuários administradores também recebem acesso à área administrativa.

Rotas protegidas

Algumas páginas só podem ser acessadas por usuários autenticados.

O projeto possui componentes específicos para controle de acesso:

RotaProtegida.tsx
RotaAdmin.tsx

A RotaProtegida impede o acesso a páginas privadas sem autenticação.

A RotaAdmin restringe determinadas áreas apenas para usuários com perfil administrativo.

Integração com a API

O frontend consome a API REST do backend IHEMP através da Fetch API.

A URL base da API é configurada por uma variável de ambiente:

VITE_API_URL=https://ihemp-backend-docker.onrender.com

Dentro da aplicação:

const API_URL = import.meta.env.VITE_API_URL;

As chamadas utilizam essa variável:

fetch(`${API_URL}/api/produtos`)

Isso evita deixar a URL do backend repetida em vários arquivos e facilita a troca de ambiente.

Principais endpoints utilizados
Usuários
POST /api/usuarios
POST /api/usuarios/login
GET  /api/usuarios/perfil/me
GET  /api/usuarios
PUT  /api/usuarios/:id/admin
Produtos
GET    /api/produtos
POST   /api/produtos
PUT    /api/produtos/:id
DELETE /api/produtos/:id
Lojas
GET    /api/lojas
POST   /api/lojas
PUT    /api/lojas/:id
DELETE /api/lojas/:id
Pedidos
POST   /api/pedidos
GET    /api/pedidos/meus
GET    /api/pedidos
PUT    /api/pedidos/:id/status
DELETE /api/pedidos/:id
Variáveis de ambiente

O arquivo .env não é enviado ao GitHub.

Ao clonar o projeto em outro computador, crie um arquivo .env na raiz do frontend com:

VITE_API_URL=https://ihemp-backend-docker.onrender.com

O .env está incluído no .gitignore.

Como executar localmente

Clone o repositório:

git clone https://github.com/MATEUSMOTA45/ihemp-frontend.git

Entre na pasta:

cd ihemp-frontend

Instale as dependências:

npm install

Crie um arquivo .env:

VITE_API_URL=https://ihemp-backend-docker.onrender.com

Execute o projeto:

npm run dev

Por padrão, o Vite disponibiliza a aplicação em:

http://localhost:5173
Build

Para gerar uma versão de produção:

npm run build

Os arquivos gerados ficam na pasta:

dist/
Deploy

O frontend está publicado na Vercel.

Aplicação:

https://ihemp-frontend.vercel.app

O projeto está integrado ao GitHub.

O fluxo funciona assim:

Alteração no código
        ↓
git commit
        ↓
git push
        ↓
GitHub
        ↓
Vercel detecta a alteração
        ↓
Build do projeto
        ↓
Deploy automático

A variável VITE_API_URL também está configurada no ambiente da Vercel.

Backend

O backend está publicado separadamente no Render.

API:

https://ihemp-backend-docker.onrender.com

Repositório:

ihemp-backend

O backend utiliza:

Node.js
Express
MongoDB Atlas
Mongoose
JWT
bcryptjs
Docker
Render
Interface

A interface utiliza um tema escuro com identidade visual em tons de verde.

Entre os elementos estilizados estão:

Navbar
Formulários
Cards
Área administrativa
Botões
Estados dos pedidos
Layout responsivo

O CSS foi organizado para manter consistência visual entre as páginas sem depender de bibliotecas externas de componentes.

Status do projeto
Implementado
React + TypeScript
Vite
React Router
Context API
Cadastro
Login
Logout
JWT
Perfil protegido
Rotas protegidas
Rotas administrativas
Navbar dinâmica
Listagem de produtos
Carrinho
Validação de estoque
Validação de loja
Finalização de pedidos
Meus pedidos
Área administrativa
Gerenciamento de usuários
CRUD de produtos
CRUD de lojas
Gerenciamento de pedidos
Atualização de status
Integração com backend
Variáveis de ambiente
Interface responsiva
Git e GitHub
Deploy na Vercel
Próximas melhorias
Melhorias de UX
Notificações visuais
Loading states mais avançados
Tratamento centralizado de erros
Busca de produtos
Filtros por categoria
Paginação
Upload e exibição de imagens
Persistência do carrinho no navegador
Melhorias de acessibilidade
Testes automatizados
Melhorias de responsividade
Refinamento da interface administrativa
Repositórios
Frontend

ihemp-frontend

Backend

ihemp-backend

Autor

Mateus Henrique Ferreira Mota

Desenvolvedor Full Stack Júnior
Estudante de Análise e Desenvolvimento de Sistemas.

GitHub:

github.com/MATEUSMOTA45