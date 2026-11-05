import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { enviarParaApi } from './api';
import { contar, enfileirar, listar, remover, sincronizar, type RegistroFila } from './fila';

afterEach(async () => {
  for (const registro of await listar()) await remover(registro.id!);
});

describe('fila offline', () => {
  it('guarda registros com uuid e data, na ordem em que foram salvos', async () => {
    await enfileirar({ observacao: 'primeiro' });
    await enfileirar({ observacao: 'segundo' });

    const fila = await listar();
    expect(fila.map((r) => r.dados.observacao)).toEqual(['primeiro', 'segundo']);
    expect(fila[0].uuid).not.toBe(fila[1].uuid);
    expect(new Date(fila[0].criadoEm).toISOString()).toBe(fila[0].criadoEm);
  });

  it('envia tudo em ordem e deixa a fila vazia', async () => {
    await enfileirar({ n: 1 });
    await enfileirar({ n: 2 });
    const enviar = vi.fn(async (_: RegistroFila) => {});

    const resultado = await sincronizar(enviar);

    expect(resultado).toEqual({ enviados: 2, restantes: 0 });
    expect(enviar.mock.calls.map(([r]) => r.dados.n)).toEqual([1, 2]);
    expect(await contar()).toBe(0);
  });

  it('para no primeiro erro e mantém o que não foi enviado', async () => {
    await enfileirar({ n: 1 });
    await enfileirar({ n: 2 });
    await enfileirar({ n: 3 });
    const enviar = vi.fn(async (r: RegistroFila) => {
      if (r.dados.n === 2) throw new Error('sem rede');
    });

    const resultado = await sincronizar(enviar);

    expect(resultado).toEqual({ enviados: 1, restantes: 2, erro: 'sem rede' });
    expect((await listar()).map((r) => r.dados.n)).toEqual([2, 3]);
  });

  it('não envia em dobro quando a sincronia é chamada duas vezes ao mesmo tempo', async () => {
    await enfileirar({ n: 1 });
    const enviar = vi.fn(async (_: RegistroFila) => {});

    const [a, b] = await Promise.all([sincronizar(enviar), sincronizar(enviar)]);

    expect(enviar).toHaveBeenCalledTimes(1);
    expect(a).toBe(b);
  });

  it('envia também o que foi salvo durante a sincronia', async () => {
    await enfileirar({ n: 1 });
    const enviados: unknown[] = [];
    const enviar = async (r: RegistroFila) => {
      enviados.push(r.dados.n);
      if (r.dados.n === 1) await enfileirar({ n: 2 });
    };

    const resultado = await sincronizar(enviar);

    expect(enviados).toEqual([1, 2]);
    expect(resultado.restantes).toBe(0);
  });
});

describe('enviarParaApi', () => {
  const registro: RegistroFila = { id: 1, uuid: 'abc', criadoEm: '2026-11-04T23:00:00.000Z', dados: { observacao: 'x' } };
  const resposta = (status: number) => vi.fn(async () => new Response(null, { status })) as unknown as typeof fetch;

  it('manda o uuid junto com os dados', async () => {
    const fetchFn = resposta(201);
    await enviarParaApi(registro, 'http://api.teste', fetchFn);
    const [url, opcoes] = vi.mocked(fetchFn).mock.calls[0];
    expect(url).toBe('http://api.teste/inspecoes');
    expect(JSON.parse(opcoes!.body as string)).toEqual({ uuid: 'abc', criadoEm: registro.criadoEm, observacao: 'x' });
  });

  it('trata 409 (uuid já existe) como enviado', async () => {
    await expect(enviarParaApi(registro, 'http://api.teste', resposta(409))).resolves.toBeUndefined();
  });

  it('falha em outros erros da API, para o registro continuar na fila', async () => {
    await expect(enviarParaApi(registro, 'http://api.teste', resposta(500))).rejects.toThrow('500');
  });
});
