import { act, cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Layout } from './Layout';

function mostrar(rota: string) {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<p>tela início</p>} />
          <Route path="/colmeias" element={<p>tela colmeias</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

function mudarConexao(online: boolean) {
  vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(online);
  act(() => {
    window.dispatchEvent(new Event(online ? 'online' : 'offline'));
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Layout', () => {
  it('mostra o menu, o topo e a tela da rota', () => {
    mostrar('/colmeias');

    const menu = screen.getByRole('navigation', { name: 'Principal' });
    expect(menu.querySelectorAll('a')).toHaveLength(4);
    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('main').textContent).toBe('tela colmeias');
  });

  it('marca só o item da tela atual', () => {
    mostrar('/colmeias');

    const atuais = screen.getAllByRole('link').filter((a) => a.getAttribute('aria-current') === 'page');
    expect(atuais.map((a) => a.textContent)).toEqual(['Colmeias']);
  });

  it('"Início" não fica marcado nas outras telas', () => {
    mostrar('/colmeias');
    expect(screen.getByRole('link', { name: 'Início' }).getAttribute('aria-current')).toBeNull();
  });

  it('tem o botão de ler QR no topo', () => {
    mostrar('/');
    expect(screen.getByRole('banner').querySelector('button')?.textContent).toBe('Ler QR');
  });

  it('acompanha a conexão: online, offline e online de novo', () => {
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    mostrar('/');
    expect(screen.getByRole('status').textContent).toBe('Online');

    mudarConexao(false);
    expect(screen.getByRole('status').textContent).toBe('Offline');

    mudarConexao(true);
    expect(screen.getByRole('status').textContent).toBe('Online');
  });
});
