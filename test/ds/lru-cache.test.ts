import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LRUCache,
  lruCache,
  type LruHooks,
  type LruOps,
} from '../../src/algorithms/ds/lru-cache/impl.ts';

test('lruCache 基本淘汰（容量 2）', () => {
  const ops: LruOps<string, number> = {
    capacity: 2,
    steps: [
      { op: 'put', key: 'A', value: 1 },
      { op: 'put', key: 'B', value: 2 },
      { op: 'put', key: 'C', value: 3 }, // 淘汰 A
    ],
  };
  // 淘汰 A 后：缓存顺序 [B, C]
  assert.deepEqual(lruCache(ops), ['B', 'C']);
});

test('LRUCache get 命中后提到最新', () => {
  const c = new LRUCache<string, number>(2);
  c.put('A', 1);
  c.put('B', 2);
  assert.equal(c.get('A'), 1); // A 现在最新
  c.put('C', 3); // 淘汰 B（A 刚用）
  assert.deepEqual(c.keysOldestFirst(), ['A', 'C']);
  assert.equal(c.has('B'), false);
});

test('LRUCache get 未命中返回 undefined', () => {
  const c = new LRUCache(2);
  c.put('A', 1);
  assert.equal(c.get('Z'), undefined);
});

test('LRUCache put 更新已存在 key 不增加大小', () => {
  const c = new LRUCache(2);
  c.put('A', 1);
  c.put('B', 2);
  c.put('A', 10); // 更新
  assert.equal(c.size, 2);
  assert.equal(c.get('A'), 10);
  // A 提到最新，B 现在最旧
  assert.deepEqual(c.keysOldestFirst(), ['B', 'A']);
});

test('LRUCache 容量下限为 1', () => {
  const c = new LRUCache(0);
  c.put('A', 1);
  c.put('B', 2); // 淘汰 A
  assert.deepEqual(c.keysOldestFirst(), ['B']);
});

test('LRUCache 钩子：命中 / 未命中 / 淘汰 / 写入', () => {
  const c = new LRUCache<string, number>(2);
  const hits: string[] = [];
  const misses: string[] = [];
  const evicts: string[] = [];
  const puts: Array<{ key: string; isNew: boolean }> = [];
  const hooks: LruHooks<string, number> = {
    onHit: (k) => hits.push(k),
    onMiss: (k) => misses.push(k),
    onEvict: (k) => evicts.push(k),
    onPut: (k, _v, isNew) => puts.push({ key: k, isNew }),
  };
  c.put('A', 1, hooks); // new
  c.put('B', 2, hooks); // new
  c.get('A', hooks); // hit
  c.put('C', 3, hooks); // new + evict B
  c.get('B', hooks); // miss
  assert.deepEqual(hits, ['A']);
  assert.deepEqual(misses, ['B']);
  assert.deepEqual(evicts, ['B']);
  assert.deepEqual(puts, [
    { key: 'A', isNew: true },
    { key: 'B', isNew: true },
    { key: 'C', isNew: true },
  ]);
});

test('LRUCache 容量 1 连续 put 每次淘汰', () => {
  const c = new LRUCache(1);
  c.put('A', 1);
  c.put('B', 2);
  c.put('C', 3);
  assert.deepEqual(c.keysOldestFirst(), ['C']);
  assert.equal(c.get('A'), undefined);
});
