import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import BenefitsSection from "../components/home/BenefitsSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import StoresSection from "../components/home/StoresSection";
import OffersSection from "../components/home/OffersSection";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import CategoryIcon from "../components/ui/CategoryIcon";
import type { CategoryIconName } from "../components/ui/CategoryIcon";
import Container from "../components/ui/Container";
import Icon from "../components/ui/Icon";

import "../styles/home.css";
import "../styles/home-stores.css";
const categorias: {
  nome: string;
  icone: CategoryIconName;
}[] = [
  { nome: "Flores", icone: "flower" },
  { nome: "Comestíveis", icone: "edible" },
  { nome: "Pré-rolls", icone: "pre-roll" },
  { nome: "Concentrados", icone: "concentrate" },
  { nome: "Vapes", icone: "vape" },
  { nome: "Tópicos", icone: "topical" },
  { nome: "Acessórios", icone: "accessory" },
];

function Home() {
  const navigate = useNavigate();
  const [endereco, setEndereco] = useState("");
  const [mensagemLocalizacao, setMensagemLocalizacao] = useState("");

  function explorar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (!endereco.trim()) {
      setMensagemLocalizacao("Digite seu endereço ou CEP para continuar.");
      return;
    }

    setMensagemLocalizacao("");
    navigate("/produtos");
  }

  function usarLocalizacao() {
    if (!navigator.geolocation) {
      setMensagemLocalizacao("Seu navegador não oferece localização automática.");
      return;
    }

    setMensagemLocalizacao("Buscando sua localização...");

    navigator.geolocation.getCurrentPosition(
      () => {
        setEndereco("Localização atual");
        setMensagemLocalizacao("Localização selecionada com sucesso.");
      },
      () => {
        setMensagemLocalizacao("Não foi possível acessar sua localização.");
      },
    );
  }

  return (
    <main className="ihemp-home">
      <Container>
        {/* Banner principal */}
        <section className="home-hero">
          <div className="home-hero__content">
            <Badge variant="success" dot>
              Marketplace IHEMP
            </Badge>

            <h1>
              Encontre o que você procura
              <span> perto de você</span>
            </h1>

            <p>
              Lojas de confiança, produtos de qualidade e uma experiência de
              compra simples e segura.
            </p>

            <form className="home-location" onSubmit={explorar}>
              <label className="home-location__field">
                <Icon name="location" size={21} />

                <input
                  type="text"
                  value={endereco}
                  onChange={(evento) => setEndereco(evento.target.value)}
                  placeholder="Digite seu endereço ou CEP"
                  aria-label="Endereço ou CEP"
                />
              </label>

              <Button type="submit" size="large">
                Explorar produtos
              </Button>
            </form>

            <button
              className="home-location__current"
              type="button"
              onClick={usarLocalizacao}
            >
              <Icon name="location" size={18} />
              Usar minha localização atual
            </button>

            {mensagemLocalizacao && (
              <p className="home-location__message" aria-live="polite">
                {mensagemLocalizacao}
              </p>
            )}
          </div>
        </section>

        {/* Categorias */}
        <section className="home-section" aria-labelledby="categorias-title">
          <div className="home-section__header">
            <div>
              <span className="home-section__eyebrow">Explore por tipo</span>
              <h2 id="categorias-title">Categorias</h2>
            </div>

            <Link to="/produtos">
              Ver todas
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="home-categories">
            {categorias.map((categoria) => (
              <Link
                key={categoria.nome}
                to={`/produtos?categoria=${encodeURIComponent(categoria.nome)}`}
              >
                <Card variant="outlined" padding="small" interactive>
                  <span className="home-category__icon" aria-hidden="true">
                  <CategoryIcon name={categoria.icone} />
                  </span>

                  <strong>{categoria.nome}</strong>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Lojas cadastradas no backend */}
        <StoresSection />

        {/* Produtos mais vendidos */}
        <FeaturedProducts />

        {/* Ofertas para você */}
        <OffersSection />

        {/* Benefícios do IHEMP */}
        <BenefitsSection />

      </Container>
    </main>
  );
}

export default Home;
