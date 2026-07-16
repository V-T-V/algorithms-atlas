import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  LFUCache,
  lfuCache,
  type LfuHooks,
  type LfuOps,
} from '../../src/algorithms/ds/lfu-cache/impl.ts';

test('LFUCache 基本淘汰：满时淘汰频率最低', () => {
  const c = new LFUCache<string, number>(2);
  c.put('A', 1);
  c.put('B', 2);
  c.get('A'); // A: freq2
  c.put('C', 3); // 淘汰 B（freq1）
  assert.equal(c.has('A'), true);
  assert.equal(c.has('C'), true);
  assert.equal(c.has('B'), false);
});

test('LFUCache 同频按 LRU 淘汰', () => {
  const c = new LFUCache<string, number>(3);
  c.put('A', 1); // freq1
  c.put('B', 2); // freq1
  c.put('C', 3); // freq1
  // 都 freq1，顺序 A<B<C
  c.put('D', 4); // 淘汰 A（最旧）
  assert.equal(c.has('A'), false);
  assert.equal(c.has('B'), true);
  assert.equal(c.has('D'), true);
});

test('LFUCache get 未命中返回 undefined', () => {
  const c = new LFUCache(2);
  c.put('A', 1);
  assert.equal(c.get('Z'), undefined);
});

test('LFUCache put 更新已存在 key 提升频率', () => {
  const c = new LFUCache<string, number>(2);
  c.put('A', 1);
  c.put('B', 2);
  c.put('A', 9); // A 更新 + freq2
  assert.equal(c.get('A'), 9);
  c.put('C', 3); // 淘汰 B（freq1）
  assert.equal(c.has('B'), false);
  assert.equal(c.has('A'), true);
});

test('LFUCache 容量下限为 1', () => {
  const c = new LFUCache(0);
  c.put('A', 1);
  c.put('B', 2); // 淘汰 A
  assert.deepEqual(
    c.entries().map((e) => e.key),
    ['B'],
  );
});

test('LFUCache 钩子：命中 / 未命中 / 淘汰 / 写入', () => {
  const c = new LFUCache<string, number>(2);
  const hits: string[] = [];
  const misses: string[] = [];
  const evicts: string[] = [];
  const puts: Array<{ key: string; isNew: boolean }> = [];
  const hooks: LfuHooks<string, number> = {
    onHit: (k) => hits.push(k),
    onMiss: (k) => misses.push(k),
    onEvict: (k) => evicts.push(k),
    onPut: (k, _v, isNew) => puts.push({ key: k, isNew }),
  };
  c.put('A', 1, hooks);
  c.put('B', 2, hooks);
  c.get('A', hooks); // hit
  c.put('C', 3, hooks); // evict B
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

test('lfuCache 便利函数返回最终条目', () => {
  const ops: LfuOps<string, number> = {
    capacity: 2,
    steps: [
      { op: 'put', key: 'A', value: 1 },
      { op: 'put', key: 'B', value: 2 },
      { op: 'get', key: 'A' },
      { op: 'put', key: 'C', value: 3 },
    ],
  };
  const out = lfuCache(ops);
  assert.equal(out.length, 2);
  // A: freq2, C: freq1
  const a = out.find((e) => e.key === 'A');
  const c = out.find((e) => e.key === 'C');
  assert.equal(a?.freq, 2);
  assert.equal(c?.freq, 1);
});

test('LFUCache 命中后 minFreq 正确更新', () => {
  const c = new LFUCache<string, number>(2);
  c.put('A', 1);
  c.put('B', 2);
  assert.equal(c.minFrequency, 1);
  c.get('A');
  // 现在 A:freq2, B:freq1 → minFreq=1
  assert.equal(c.minFrequency, 1);
  c.get('B');
  // A:freq2, B:freq2 → minFreq=2
  assert.equal(c.minFrequency, 2);
});
