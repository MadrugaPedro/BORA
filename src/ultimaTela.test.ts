import { beforeEach, describe, expect, it } from 'vitest';
import { lerUltimaTela, salvarUltimaTela } from './ultimaTela';

describe('ultimaTela', () => {
  beforeEach(() => localStorage.clear());

  it('devolve nulo quando nada foi salvo', () => {
    expect(lerUltimaTela()).toBeNull();
  });

  it('devolve o último caminho salvo, com a query', () => {
    salvarUltimaTela('/colmeias?fazenda=2');
    expect(lerUltimaTela()).toBe('/colmeias?fazenda=2');
  });

  it('ignora valores que não são caminho interno', () => {
    salvarUltimaTela('https://exemplo.com');
    expect(lerUltimaTela()).toBeNull();
    salvarUltimaTela('//exemplo.com');
    expect(lerUltimaTela()).toBeNull();
  });
});
