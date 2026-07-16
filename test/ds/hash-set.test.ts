import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HashSet, hashSet } from '../../src/algorithms/ds/hash-set/impl.ts';
import { buildTrace } from '../../src/algorithms/ds/hash-set/trace.ts';

test('hash-set add 去重', () => {
  const s = new HashSet(8);
  assert.equal(s.add('a'), true);
  assert.equal(s.add('b'), true);
  assert.equal(s.add('a'), false); // 已存在
  assert.equal(s.size, 2);
});

test('hash-set 便利函数去重', () => {
  const out = hashSet(['a', 'b', 'a', 'c', 'b']).sort();
  assert.deepEqual(out, ['a', 'b', 'c']);
  assert.deepEqual(hashSet([]), []);
});

test('hash-set contains / remove', () => {
  const s = new HashSet(8);
  s.add('x');
  s.add('y');
  assert.equal(s.contains('x'), true);
  assert.equal(s.contains('z'), false);
  assert.equal(s.remove('x'), true);
  assert.equal(s.contains('x'), false);
  assert.equal(s.remove('x'), false); // 再删返回 false
  assert.equal(s.size, 1);
});

test('hash-set 冲突：同桶链表正确（极小桶数）', () => {
  const s = new HashSet(1);
  for (let i = 0; i < 30; i++) s.add(`k${i}`);
  assert.equal(s.size, 30);
  for (let i = 0; i < 30; i++) assert.equal(s.contains(`k${i}`), true);
  // 删除一半
  for (let i = 0; i < 30; i += 2) s.remove(`k${i}`);
  assert.equal(s.size, 15);
  for (let i = 1; i < 30; i += 2) assert.equal(s.contains(`k${i}`), true);
  for (let i = 0; i < 30; i += 2) assert.equal(s.contains(`k${i}`), false);
});

test('hash-set values 返回全部元素', () => {
  const s = new HashSet(8);
  for (const k of ['p', 'q', 'r']) s.add(k);
  assert.deepEqual(s.values().sort(), ['p', 'q', 'r']);
});

test('hash-set 扩容 rehash', () => {
  let resizes = 0;
  let last = [0, 0];
  const s = new HashSet(4); // LOAD_FACTOR 0.75 → size>3 触发
  for (let i = 0; i < 10; i++)
    s.add(`item${i}`, {
      onResize: (o, n) => {
        resizes++;
        last = [o, n];
      },
    });
  assert.ok(resizes >= 1, '应至少扩容一次');
  assert.equal(s.capacity, 4 * Math.pow(2, resizes));
  // 扩容后元素仍在
  for (let i = 0; i < 10; i++) assert.equal(s.contains(`item${i}`), true);
  assert.equal(s.size, 10);
  void last;
});

test('hash-set 空串 / 数字串 key', () => {
  const s = new HashSet(4);
  s.add('');
  s.add('1');
  s.add('11');
  assert.equal(s.contains(''), true);
  assert.equal(s.contains('1'), true);
  assert.equal(s.contains('11'), true);
  assert.equal(s.contains('2'), false);
});

test('hash-set 钩子被调用', () => {
  let hashes = 0;
  let adds = 0;
  let probes = 0;
  const s = new HashSet(3);
  s.add('a', { onHash: () => hashes++, onAdd: () => adds++ });
  s.contains('a', { onProbe: () => probes++ });
  assert.ok(hashes > 0);
  assert.equal(adds, 1);
  assert.ok(probes > 0);
});

test('hash-set contains 未命中也回调 onResult', () => {
  let called = 0;
  let found = true;
  const s = new HashSet(7);
  s.contains('missing', {
    onResult: (_kind, _key, f) => {
      called++;
      found = f;
    },
  });
  assert.equal(called, 1);
  assert.equal(found, false);
});

test('hash-set buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.map !== undefined);
});
