import { IconeQr } from './icones';
import { useOnline } from './useOnline';

export function Topo() {
  const online = useOnline();

  return (
    <header className="topo">
      <span className="topo__marca">Borá</span>
      <div className="topo__acoes">
        <p className={`conexao ${online ? 'conexao--online' : 'conexao--offline'}`} role="status">
          <span className="conexao__ponto" aria-hidden="true" />
          {online ? 'Online' : 'Offline'}
        </p>
        {/* A leitura do QR é outra tarefa: por enquanto o botão só ocupa o lugar. */}
        <button type="button" className="botao-qr">
          <IconeQr />
          <span>Ler QR</span>
        </button>
      </div>
    </header>
  );
}
