import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HashMap, hashMap } from '../../src/algorithms/ds/hash-map/impl.ts';
import { buildTrace } from '../../src/algorithms/ds/hash-map/trace.ts';

test('hash-map 插入与查找', () => {
  const m = new HashMap(8);
  assert.equal(m.put('apple', 1), true);
  assert.equal(m.put('banana', 2), true);
  assert.equal(m.put('cherry', 3), true);
  assert.equal(m.size, 3);
  assert.equal(m.get('apple'), 1);
  assert.equal(m.get('banana'), 2);
  assert.equal(m.get('grape'), undefined);
});

test('hash-map 更新已存在的键', () => {
  const m = new HashMap(8);
  assert.equal(m.put('apple', 1), true);
  assert.equal(m.put('apple', 10), false); // 更新
  assert.equal(m.size, 1);
  assert.equal(m.get('apple'), 10);
});

test('hash-map 便利函数', () => {
  const m = hashMap(
    [
      { key: 'a', value: 1 },
      { key: 'b', value: 2 },
    ],
    5,
  );
  assert.equal(m.get('a'), 1);
  assert.equal(m.get('b'), 2);
  assert.equal(m.size, 2);
});

test('hash-map 删除', () => {
  const m = hashMap(
    [
      { key: 'a', value: 1 },
      { key: 'b', value: 2 },
      { key: 'c', value: 3 },
    ],
    5,
  );
  assert.equal(m.delete('b'), true);
  assert.equal(m.get('b'), undefined);
  assert.equal(m.size, 2);
  assert.equal(m.delete('b'), false);
  assert.equal(m.delete('zzz'), false);
});

test('hash-map has 与 keys', () => {
  const m = hashMap(
    [
      { key: 'x', value: 1 },
      { key: 'y', value: 2 },
    ],
    5,
  );
  assert.equal(m.has('x'), true);
  assert.equal(m.has('z'), false);
  assert.deepEqual(m.keys().sort(), ['x', 'y']);
});

test('hash-map 冲突：同桶链表正确（极小桶数）', () => {
  const m = new HashMap(1);
  for (let i = 0; i < 50; i++) m.put(`key${i}`, i);
  assert.equal(m.size, 50);
  for (let i = 0; i < 50; i++) assert.equal(m.get(`key${i}`), i);
});

test('hash-map 扩容 rehash', () => {
  let resizes = 0;
  const m = new HashMap(4);
  for (let i = 0; i < 10; i++) m.put(`item${i}`, i, { onResize: () => resizes++ });
  assert.ok(resizes >= 1, '应至少扩容一次');
  // 扩容后数据仍完整
  for (let i = 0; i < 10; i++) assert.equal(m.get(`item${i}`), i);
  assert.equal(m.size, 10);
});

test('hash-map 边界：空 / 空 key', () => {
  const m = new HashMap(7);
  assert.equal(m.isEmpty(), true);
  assert.equal(m.get('anything'), undefined);
  assert.equal(m.delete('anything'), false);
  m.put('', 99);
  assert.equal(m.get(''), 99);
  assert.equal(m.size, 1);
  assert.equal(m.isEmpty(), false);
});

test('hash-map 钩子被调用', () => {
  let hashes = 0;
  let inserts = 0;
  let updates = 0;
  let probes = 0;
  const m = new HashMap(8);
  m.put('a', 1, { onHash: () => hashes++, onInsert: () => inserts++ });
  m.put('a', 2, { onUpdate: () => updates++ });
  m.get('a', { onProbe: () => probes++ });
  assert.ok(hashes > 0);
  assert.equal(inserts, 1);
  assert.equal(updates, 1);
  assert.ok(probes > 0);
});

test('hash-map get 未命中也回调 onResult', () => {
  let called = 0;
  let found = true;
  const m = new HashMap(7);
  m.get('missing', {
    onResult: (_kind, _key, f) => {
      called++;
      found = f;
    },
  });
  assert.equal(called, 1);
  assert.equal(found, false);
});

test('hash-map buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.map !== undefined);
});
