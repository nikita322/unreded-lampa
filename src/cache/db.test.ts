import { describe, expect, it } from 'vitest';
import { Database } from './db';

let seq = 0;

function uniqueName(): string {
  seq += 1;
  return `test-db-${seq}`;
}

async function openDb(
  stores: readonly string[] = ['items'],
  version = 1,
): Promise<Database> {
  const db = new Database({ name: uniqueName(), version, stores });
  await db.open();
  return db;
}

describe('Database', () => {
  it('open создаёт заявленные хранилища', async () => {
    const db = await openDb(['images', 'other']);

    await expect(db.add('images', 'a', 1)).resolves.toBeUndefined();
    await expect(db.add('other', 'b', 2)).resolves.toBeUndefined();
  });

  it('повышение версии добавляет новое хранилище', async () => {
    const name = uniqueName();

    const first = new Database({ name, version: 1, stores: ['images'] });
    await first.open();
    await first.add('images', 'k', 'v');
    first.close();

    const second = new Database({
      name,
      version: 2,
      stores: ['images', 'themes'],
    });
    await second.open();

    await expect(second.add('themes', 't', 1)).resolves.toBeUndefined();
  });

  it('open без хранилищ отклоняется', async () => {
    const db = new Database({ name: uniqueName(), version: 1, stores: [] });
    await expect(db.open()).rejects.toThrow();
  });

  it('повторный open не падает', async () => {
    const db = await openDb();
    await expect(db.open()).resolves.toBeUndefined();
  });

  it('get возвращает сохранённое значение', async () => {
    const db = await openDb();
    await db.add('items', 'poster', { url: 'https://example/poster.jpg' });

    await expect(db.get('items', 'poster')).resolves.toEqual({
      url: 'https://example/poster.jpg',
    });
  });

  it('get возвращает null для отсутствующего ключа', async () => {
    const db = await openDb();
    await expect(db.get('items', 'missing')).resolves.toBeNull();
  });

  it('get возвращает null, когда TTL истёк', async () => {
    const db = await openDb();
    await db.add('items', 'k', 'v');

    await expect(db.get('items', 'k', { ttlMs: 0 })).resolves.toBeNull();
  });

  it('get возвращает значение, когда TTL не истёк', async () => {
    const db = await openDb();
    await db.add('items', 'k', 'v');

    await expect(db.get('items', 'k', { ttlMs: 60_000 })).resolves.toBe('v');
  });

  it('getAll возвращает все значения хранилища', async () => {
    const db = await openDb();
    await db.add('items', 'a', 1);
    await db.add('items', 'b', 2);

    const values = await db.getAll<number>('items');
    expect(values).toHaveLength(2);
    expect(values).toEqual(expect.arrayContaining([1, 2]));
  });

  it('update обновляет значение существующего ключа', async () => {
    const db = await openDb();
    await db.add('items', 'k', 'old');
    await db.update('items', 'k', 'new');

    await expect(db.get('items', 'k')).resolves.toBe('new');
  });

  it('update несуществующего ключа отклоняется', async () => {
    const db = await openDb();
    await expect(db.update('items', 'missing', 'v')).rejects.toThrow();
  });

  it('upsert добавляет отсутствующий ключ и перезаписывает существующий', async () => {
    const db = await openDb();

    await db.upsert('items', 'k', 1);
    await expect(db.get('items', 'k')).resolves.toBe(1);

    await db.upsert('items', 'k', 2);
    await expect(db.get('items', 'k')).resolves.toBe(2);
  });

  it('remove удаляет значение', async () => {
    const db = await openDb();
    await db.add('items', 'k', 'v');
    await db.remove('items', 'k');

    await expect(db.get('items', 'k')).resolves.toBeNull();
  });

  it('clearStore очищает одно хранилище, не трогая другие', async () => {
    const db = await openDb(['a', 'b']);
    await db.add('a', 'k1', 1);
    await db.add('b', 'k2', 2);

    await db.clearStore('a');

    await expect(db.get('a', 'k1')).resolves.toBeNull();
    await expect(db.get('b', 'k2')).resolves.toBe(2);
  });

  it('clearAll очищает все хранилища', async () => {
    const db = await openDb(['a', 'b']);
    await db.add('a', 'k1', 1);
    await db.add('b', 'k2', 2);

    await db.clearAll();

    await expect(db.get('a', 'k1')).resolves.toBeNull();
    await expect(db.get('b', 'k2')).resolves.toBeNull();
  });
});
