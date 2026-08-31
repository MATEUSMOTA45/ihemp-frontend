import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type RotaAdminProps = {
  children: React.ReactNode;
};

function RotaAdmin({ children }: RotaAdminProps) {
  const { estaLogado, usuario } = useAuth();

  if (!estaLogado) {
    return <Navigate to="/login" replace />;
  }

  if (!usuario) {
    return <p>Carregando usuário...</p>;
  }

  if (usuario.tipo !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RotaAdmin;
