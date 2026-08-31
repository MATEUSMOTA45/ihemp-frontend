import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type RotaProtegidaProps = {
  children: React.ReactNode;
};

function RotaProtegida({ children }: RotaProtegidaProps) {
  const { estaLogado } = useAuth();

  if (!estaLogado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RotaProtegida;