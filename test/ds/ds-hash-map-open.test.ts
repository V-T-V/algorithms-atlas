import { test } from 'node:test';
import assert from 'node:assert/strict';
import { OpenHashMap } from '../../src/algorithms/ds/ds-hash-map-open/impl.ts';

test('OpenHashMap put/get', () => {
  const m = new OpenHashMap();
  m.put('a', 1);
  m.put('b', 2);
  m.put('c', 3);
  assert.equal(m.get('a'), 1);
  assert.equal(m.get('b'), 2);
  assert.equal(m.get('c'), 3);
  assert.equal(m.get('d'), undefined);
});

test('OpenHashMap 覆盖', () => {
  const m = new OpenHashMap();
  m.put('a', 1);
  m.put('a', 100);
  assert.equal(m.get('a'), 100);
  assert.equal(m.length, 1);
});

test('OpenHashMap has', () => {
  const m = new OpenHashMap();
  m.put('x', 42);
  assert.equal(m.has('x'), true);
  assert.equal(m.has('y'), false);
});

test('OpenHashMap delete', () => {
  const m = new OpenHashMap();
  m.put('a', 1);
  m.put('b', 2);
  assert.equal(m.delete('a'), true);
  assert.equal(m.get('a'), undefined);
  assert.equal(m.length, 1);
  assert.equal(m.delete('zzz'), false);
  // 删除后仍可插入新键
  m.put('c', 3);
  assert.equal(m.get('c'), 3);
  assert.equal(m.length, 2);
});

test('OpenHashMap 删除后重插同键', () => {
  const m = new OpenHashMap();
  m.put('k', 10);
  m.delete('k');
  m.put('k', 20);
  assert.equal(m.get('k'), 20);
});

test('OpenHashMap 扩容触发', () => {
  const m = new OpenHashMap(4);
  // 初始容量 4，负载因子 0.7 → 插入 3 个即应扩容
  for (let i = 0; i < 20; i++) m.put(`key${i}`, i);
  assert.equal(m.length, 20);
  for (let i = 0; i < 20; i++) assert.equal(m.get(`key${i}`), i);
});

test('OpenHashMap 冲突键', () => {
  // 用大量键测试冲突处理
  const m = new OpenHashMap();
  const n = 200;
  for (let i = 0; i < n; i++) m.put(`item_${i}`, i * 2);
  assert.equal(m.length, n);
  for (let i = 0; i < n; i++) assert.equal(m.get(`item_${i}`), i * 2);
});

test('OpenHashMap 与 Map 对照', () => {
  const m = new OpenHashMap();
  const ref = new Map<string, number>();
  for (let i = 0; i < 500; i++) {
    const k = `k${(i * 37) % 100}`;
    m.put(k, i);
    ref.set(k, i);
  }
  assert.equal(m.length, ref.size);
  for (const [k, v] of ref) assert.equal(m.get(k), v);
});
