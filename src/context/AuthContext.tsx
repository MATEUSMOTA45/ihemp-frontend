import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

// URL base da API vinda do arquivo .env
const API_URL = import.meta.env.VITE_API_URL;

// Tipo do usuário autenticado
type Usuario = {
  _id: string;
  nome: string;
  email: string;
  tipo: string;
  ativo: boolean;
};

// Tipo dos dados disponíveis no contexto
type AuthContextType = {
  estaLogado: boolean;
  usuario: Usuario | null;
  login: (token: string) => void;
  logout: () => void;
};

// Cria o contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tipo das propriedades do AuthProvider
type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  // Verifica se já existe um token salvo
  const [estaLogado, setEstaLogado] = useState(
    Boolean(localStorage.getItem("token"))
  );

  // Guarda os dados do usuário logado
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // Busca os dados do usuário autenticado
  async function carregarUsuario() {
    const token = localStorage.getItem("token");

    // Se não existir token, remove o usuário do estado
    if (!token) {
      setUsuario(null);
      return;
    }

    try {
      const resposta = await fetch(
        `${API_URL}/api/usuarios/perfil/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Se o token for inválido ou expirado, faz logout
      if (!resposta.ok) {
        logout();
        return;
      }

      // Converte a resposta para JSON
      const dados = await resposta.json();

      // Salva os dados do usuário no contexto
      setUsuario(dados);
    } catch {
      // Em caso de erro de conexão, limpa o usuário
      setUsuario(null);
    }
  }

  // Faz login salvando o token
  function login(token: string) {
    localStorage.setItem("token", token);

    // Atualiza o estado global de autenticação
    setEstaLogado(true);
  }

  // Faz logout removendo o token
  function logout() {
    localStorage.removeItem("token");

    // Atualiza os estados
    setEstaLogado(false);
    setUsuario(null);
  }

  // Busca os dados do usuário sempre que o login mudar
  useEffect(() => {
    if (estaLogado) {
      carregarUsuario();
    }
  }, [estaLogado]);

  // Disponibiliza os dados para toda a aplicação
  return (
    <AuthContext.Provider
      value={{
        estaLogado,
        usuario,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acessar a autenticação
export function useAuth() {
  const contexto = useContext(AuthContext);

  // Evita usar o contexto fora do AuthProvider
  if (!contexto) {
    throw new Error(
      "useAuth deve ser usado dentro de AuthProvider"
    );
  }

  return contexto;
}