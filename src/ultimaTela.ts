const CHAVE = 'bora:ultima-tela';

export function salvarUltimaTela(caminho: string): void {
  try {
    localStorage.setItem(CHAVE, caminho);
  } catch {
    // Armazenamento indisponível (modo privado, cota cheia): o app segue sem lembrar a tela.
  }
}

export function lerUltimaTela(): string | null {
  try {
    const caminho = localStorage.getItem(CHAVE);
    // Só caminhos internos: evita redirecionar para outro endereço.
    return caminho && caminho.startsWith('/') && !caminho.startsWith('//') ? caminho : null;
  } catch {
    return null;
  }
}
