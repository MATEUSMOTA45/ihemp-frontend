type OpcoesComTentativas = RequestInit & {
  tentativas?: number;
  intervaloMs?: number;
};

function deveTentarNovamente(status: number) {
  return status === 408 || status === 429 || status >= 500;
}

function esperar(tempoMs: number, signal?: AbortSignal | null) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Requisição cancelada", "AbortError"));
      return;
    }

    const temporizador = window.setTimeout(() => {
      signal?.removeEventListener("abort", cancelarEspera);
      resolve();
    }, tempoMs);

    function cancelarEspera() {
      window.clearTimeout(temporizador);
      reject(new DOMException("Requisição cancelada", "AbortError"));
    }

    signal?.addEventListener("abort", cancelarEspera, { once: true });
  });
}

// Repete falhas temporárias enquanto a API termina de iniciar.
export async function fetchComTentativas(
  url: string,
  opcoes: OpcoesComTentativas = {},
) {
  const {
    tentativas = 4,
    intervaloMs = 2_000,
    ...configuracaoFetch
  } = opcoes;

  let ultimoErro: unknown = new Error("Não foi possível acessar a API.");

  for (let tentativa = 1; tentativa <= tentativas; tentativa += 1) {
    try {
      const resposta = await fetch(url, configuracaoFetch);

      if (
        tentativa === tentativas ||
        !deveTentarNovamente(resposta.status)
      ) {
        return resposta;
      }

      ultimoErro = new Error(
        `A API respondeu com status ${resposta.status}.`,
      );
    } catch (erro) {
      if (configuracaoFetch.signal?.aborted) {
        throw erro;
      }

      ultimoErro = erro;
    }

    await esperar(intervaloMs * tentativa, configuracaoFetch.signal);
  }

  throw ultimoErro;
}