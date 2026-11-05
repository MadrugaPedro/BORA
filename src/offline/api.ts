import type { RegistroFila } from './fila';

// Endereço da API. Sem ele, o envio é simulado (só para a prova de conceito).
export const API_URL = import.meta.env.VITE_API_URL;

// ATENÇÃO: rota e formato do corpo são suposições até o contrato de inspeção ser definido no back-end.
export async function enviarParaApi(
  registro: RegistroFila,
  apiUrl: string,
  fetchFn: typeof fetch = fetch,
): Promise<void> {
  const resposta = await fetchFn(`${apiUrl}/inspecoes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uuid: registro.uuid, criadoEm: registro.criadoEm, ...registro.dados }),
  });
  // 409: a API já tem esse uuid (reenvio de algo que chegou mas cuja resposta se perdeu). Conta como enviado.
  if (!resposta.ok && resposta.status !== 409) {
    throw new Error(`A API respondeu ${resposta.status}`);
  }
}

export async function enviar(registro: RegistroFila): Promise<void> {
  if (!API_URL) {
    await new Promise((resolver) => setTimeout(resolver, 400));
    return;
  }
  await enviarParaApi(registro, API_URL);
}
