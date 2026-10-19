import { describe, expect, it, vi } from 'vitest';
import { Database } from '../cache';
import { cachedRequest } from './cached';

let seq = 0;

async function openDb(): Promise<Database> {
  seq += 1;
  const db = new Database({
    name: `test-api-cache-${seq}`,
    version: 1,
    stores: ['api'],
  });
  await db.open();
  return db;
}

describe('cachedRequest', () => {
  it('возвращает значение из кэша, не вызывая load', async () => {
    const db = await openDb();
    await db.upsert('api', 'k', 'cached');
    const load = vi.fn(() => Promise.resolve('fresh'));

    await expect(cachedRequest('api', 'k', 60_000, load, db)).resolves.toBe(
      'cached',
    );
    expect(load).not.toHaveBeenCalled();
  });

  it('вызывает load при промахе и сохраняет результат', async () => {
    const db = await openDb();
    const load = vi.fn(() => Promise.resolve('fresh'));

    await expect(cachedRequest('api', 'k', 60_000, load, db)).resolves.toBe(
      'fresh',
    );
    expect(load).toHaveBeenCalledTimes(1);
    await expect(db.get('api', 'k')).resolves.toBe('fresh');
  });

  it('перечитывает данные, если кэш протух', async () => {
    const db = await openDb();
    await db.upsert('api', 'k', 'stale');
    const load = vi.fn(() => Promise.resolve('fresh'));

    // ttlMs = 0 означает «мгновенно протух» — без зависимости от таймеров.
    await expect(cachedRequest('api', 'k', 0, load, db)).resolves.toBe('fresh');
    expect(load).toHaveBeenCalledTimes(1);
  });
});
