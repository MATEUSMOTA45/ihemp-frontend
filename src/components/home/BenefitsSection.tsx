import {
  BadgeCheck,
  Bike,
  Headphones,
  LockKeyhole,
} from "lucide-react";

import "../../styles/home-benefits.css";

const beneficios = [
  {
    titulo: "Lojas de confiança",
    descricao: "Parceiros verificados e selecionados",
    Icone: BadgeCheck,
  },
  {
    titulo: "Entrega rápida",
    descricao: "Entrega segura e discreta na sua casa",
    Icone: Bike,
  },
  {
    titulo: "Pagamento seguro",
    descricao: "Seus dados protegidos em todas as compras",
    Icone: LockKeyhole,
  },
  {
    titulo: "Suporte dedicado",
    descricao: "Estamos aqui para ajudar quando precisar",
    Icone: Headphones,
  },
];

function BenefitsSection() {
  return (
    <section className="home-benefits" aria-label="Benefícios do IHEMP">
      {beneficios.map(({ titulo, descricao, Icone }) => (
        <article className="home-benefit" key={titulo}>
          <span className="home-benefit__icon" aria-hidden="true">
            <Icone size={24} strokeWidth={1.9} />
          </span>

          <div>
            <h3>{titulo}</h3>
            <p>{descricao}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

export default BenefitsSection;
