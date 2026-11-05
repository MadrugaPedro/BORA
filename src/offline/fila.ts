import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

export interface RegistroFila {
  id?: number;
  // Gerado no aparelho. Permite à API ignorar reenvios (UNIQUE(uuid) em inspeção).
  uuid: string;
  criadoEm: string; // ISO em UTC
  dados: Record<string, unknown>;
}

export interface ResultadoSincronia {
  enviados: number;
  restantes: number;
  erro?: string;
}

interface BoraDB extends DBSchema {
  fila: { key: number; value: RegistroFila };
}

let banco: Promise<IDBPDatabase<BoraDB>> | null = null;

function abrirBanco() {
  banco ??= openDB<BoraDB>('bora-offline', 1, {
    upgrade(db) {
      db.createObjectStore('fila', { keyPath: 'id', autoIncrement: true });
    },
  });
  return banco;
}

export async function enfileirar(dados: Record<string, unknown>): Promise<RegistroFila> {
  const registro: RegistroFila = { uuid: crypto.randomUUID(), criadoEm: new Date().toISOString(), dados };
  const db = await abrirBanco();
  const id = await db.add('fila', registro);
  return { ...registro, id };
}

// A chave é auto-incremento, então a ordem de leitura é a ordem em que o usuário salvou.
export async function listar(): Promise<RegistroFila[]> {
  return (await abrirBanco()).getAll('fila');
}

export async function contar(): Promise<number> {
  return (await abrirBanco()).count('fila');
}

export async function remover(id: number): Promise<void> {
  await (await abrirBanco()).delete('fila', id);
}

let emAndamento: Promise<ResultadoSincronia> | null = null;

// Envia a fila em ordem e remove cada registro só depois de o envio dar certo.
// No primeiro erro para e mantém o restante para a próxima tentativa.
// Chamadas simultâneas na mesma aba (evento online + botão, por exemplo) dividem a mesma execução.
// Entre abas, o Web Locks faz uma esperar a outra terminar e então reler a fila (já vazia), sem enviar em dobro.
export function sincronizar(enviar: (registro: RegistroFila) => Promise<void>): Promise<ResultadoSincronia> {
  emAndamento ??= comTrava(() => executar(enviar)).finally(() => {
    emAndamento = null;
  });
  return emAndamento;
}

async function comTrava(tarefa: () => Promise<ResultadoSincronia>): Promise<ResultadoSincronia> {
  return navigator.locks ? await navigator.locks.request('bora-sincronizar-fila', tarefa) : await tarefa();
}

async function executar(enviar: (registro: RegistroFila) => Promise<void>): Promise<ResultadoSincronia> {
  let enviados = 0;
  try {
    // Relê a fila a cada volta para pegar o que foi salvo durante o envio.
    for (let pendentes = await listar(); pendentes.length > 0; pendentes = await listar()) {
      for (const registro of pendentes) {
        await enviar(registro);
        await remover(registro.id!);
        enviados++;
      }
    }
    return { enviados, restantes: 0 };
  } catch (e) {
    return { enviados, restantes: await contar(), erro: e instanceof Error ? e.message : String(e) };
  }
}
