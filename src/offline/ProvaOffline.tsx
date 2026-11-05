import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { API_URL, enviar } from './api';
import { contar, enfileirar, sincronizar } from './fila';

export function ProvaOffline() {
  const [online, setOnline] = useState(navigator.onLine);
  const [pendentes, setPendentes] = useState(0);
  const [enviados, setEnviados] = useState(0);
  const [observacao, setObservacao] = useState('');
  const [mensagem, setMensagem] = useState('');

  const enviarFila = useCallback(async () => {
    const resultado = await sincronizar(enviar);
    setEnviados((total) => total + resultado.enviados);
    setPendentes(resultado.restantes);
    if (resultado.erro) setMensagem(`Não foi possível enviar: ${resultado.erro}. Os registros continuam na fila.`);
    else if (resultado.enviados > 0) setMensagem(`${resultado.enviados} registro(s) enviado(s) e removido(s) da fila.`);
  }, []);

  useEffect(() => {
    const aoFicarOnline = () => {
      setOnline(true);
      void enviarFila();
    };
    const aoFicarOffline = () => setOnline(false);
    window.addEventListener('online', aoFicarOnline);
    window.addEventListener('offline', aoFicarOffline);
    // Ao abrir o app com conexão, esvazia o que sobrou de uma sessão anterior.
    void contar().then((total) => {
      setPendentes(total);
      if (total > 0 && navigator.onLine) void enviarFila();
    });
    return () => {
      window.removeEventListener('online', aoFicarOnline);
      window.removeEventListener('offline', aoFicarOffline);
    };
  }, [enviarFila]);

  async function salvar(evento: FormEvent) {
    evento.preventDefault();
    if (!observacao.trim()) return;
    // Um caminho só: salva sempre na fila e, se houver conexão, envia na hora.
    await enfileirar({ observacao: observacao.trim() });
    setObservacao('');
    setPendentes(await contar());
    if (navigator.onLine) {
      await enviarFila();
    } else {
      setMensagem('Sem internet: registro salvo no aparelho. Será enviado quando a conexão voltar.');
    }
  }

  return (
    <section style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: '28rem', fontFamily: 'var(--font-family-sans)' }}>
      <h1 style={{ color: 'var(--color-propolis)' }}>Prova de conceito offline</h1>

      <p
        role="status"
        data-testid="estado-conexao"
        style={{ color: online ? 'var(--color-propolis)' : 'var(--color-button-primary)', fontWeight: 600 }}
      >
        {online ? 'Online' : 'Offline'}
      </p>

      <form onSubmit={salvar} style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <label htmlFor="observacao">Observação do registro</label>
        <input
          id="observacao"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-propolis)' }}
        />
        <button
          type="submit"
          style={{
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            border: 0,
            color: '#fff',
            background: 'var(--color-button-primary)',
          }}
        >
          Salvar registro
        </button>
      </form>

      <p data-testid="pendentes">Na fila: {pendentes}</p>
      <p data-testid="enviados">Enviados nesta sessão: {enviados}</p>
      {mensagem && <p role="status">{mensagem}</p>}
      {!API_URL && <small>API não configurada (VITE_API_URL vazio): o envio é simulado.</small>}
    </section>
  );
}
