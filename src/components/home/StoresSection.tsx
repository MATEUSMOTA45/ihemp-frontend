import { useEffect, useState } from "react";
import { ArrowRight, MapPin, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import store01 from "../../assets/stores/store-01.webp";
import store02 from "../../assets/stores/store-02.webp";
import store03 from "../../assets/stores/store-03.webp";
import store04 from "../../assets/stores/store-04.webp";
import { fetchComTentativas } from "../../utils/fetchComTentativas";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

const API_URL = import.meta.env.VITE_API_URL;
const imagensFallback = [store01, store02, store03, store04];

type Loja = {
  _id: string;
  nome: string;
  descricao?: string;
  endereco?: string;
  imagem?: string;
  imagemUrl?: string;
  ativa?: boolean;
  ativo?: boolean;
};

function StoresSection() {
  const [lojas, setLojas] = useState<Loja[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // Busca as lojas já cadastradas no backend do IHEMP.
  useEffect(() => {
    const controle = new AbortController();

    async function carregarLojas() {
      try {
        const resposta = await fetchComTentativas(`${API_URL}/api/lojas`, {
          signal: controle.signal,
        });

        if (!resposta.ok) {
          throw new Error("Falha ao buscar lojas");
        }

        const resultado = await resposta.json();
        const lista: Loja[] = Array.isArray(resultado)
          ? resultado
          : resultado.lojas ?? [];

        setLojas(
          lista
            .filter((loja) => loja.ativa !== false && loja.ativo !== false)
            .slice(0, 4),
        );
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          setErro("Não foi possível carregar as lojas agora.");
        }
      } finally {
        if (!controle.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarLojas();

    return () => controle.abort();
  }, []);

  return (
    <section className="home-section" aria-labelledby="lojas-title">
      <div className="home-section__header">
        <div>
          <span className="home-section__eyebrow">Marketplace local</span>
          <h2 id="lojas-title">Lojas perto de você</h2>
        </div>

        <Link to="/produtos">
          Ver todas
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {carregando && (
        <div className="home-stores" aria-label="Carregando lojas">
          {[1, 2, 3, 4].map((item) => (
            <div className="home-store-skeleton" key={item} />
          ))}
        </div>
      )}

      {!carregando && erro && (
        <Card variant="soft">
          <p className="home-stores__message">{erro}</p>
        </Card>
      )}

      {!carregando && !erro && lojas.length === 0 && (
        <Card variant="soft">
          <p className="home-stores__message">
            Ainda não existem lojas disponíveis nesta região.
          </p>
        </Card>
      )}

      {!carregando && !erro && lojas.length > 0 && (
        <div className="home-stores">
          {lojas.map((loja, indice) => {
            const imagemFallback = imagensFallback[indice % imagensFallback.length];
            const imagem =
              loja.imagem ||
              loja.imagemUrl ||
              imagemFallback;

            return (
              <Link
                className="home-store"
                key={loja._id}
                to={`/produtos?loja=${loja._id}`}
              >
                <Card padding="none" interactive>
                  <div className="home-store__cover">
                    <img
                      src={imagem}
                      alt={`Interior da loja ${loja.nome}`}
                      decoding="async"
                      onError={(evento) => {
                        evento.currentTarget.onerror = null;
                        evento.currentTarget.src = imagemFallback;
                      }}
                    />

                    <Badge variant="success" dot>
                      Aberta agora
                    </Badge>
                  </div>

                  <div className="home-store__body">
                    <div className="home-store__title">
                      <h3>{loja.nome}</h3>
                      <ShieldCheck size={18} aria-label="Loja verificada" />
                    </div>

                    {loja.descricao && <p>{loja.descricao}</p>}

                    {loja.endereco && (
                      <span className="home-store__address">
                        <MapPin size={16} aria-hidden="true" />
                        {loja.endereco}
                      </span>
                    )}

                    <span className="home-store__link">
                      Ver produtos
                      <ArrowRight size={17} aria-hidden="true" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default StoresSection;
