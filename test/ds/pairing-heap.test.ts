import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PairingHeap,
  pairingHeap,
  type PairingHooks,
} from '../../src/algorithms/ds/pairing-heap/impl.ts';

test('pairingHeap extractMin 输出升序', () => {
  const h = pairingHeap([9, 4, 7, 1, 5, 3, 8, 2, 6]);
  const out: number[] = [];
  while (!h.isEmpty()) out.push(h.extractMin()!);
  assert.deepEqual(out, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('PairingHeap findMin / extractMin 基本行为', () => {
  const h = new PairingHeap();
  h.insert(5);
  h.insert(1);
  h.insert(3);
  assert.equal(h.findMin(), 1);
  assert.equal(h.extractMin(), 1);
  assert.equal(h.extractMin(), 3);
  assert.equal(h.extractMin(), 5);
  assert.equal(h.extractMin(), undefined);
});

test('PairingHeap 空堆', () => {
  const h = new PairingHeap();
  assert.equal(h.isEmpty(), true);
  assert.equal(h.findMin(), undefined);
  assert.equal(h.extractMin(), undefined);
});

test('PairingHeap 始终保持堆序', () => {
  const h = pairingHeap([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  assert.equal(h.isValid(), true);
  h.extractMin();
  assert.equal(h.isValid(), true);
});

test('PairingHeap meldHeap 合并两堆', () => {
  const a = pairingHeap([5, 1, 3]);
  const b = pairingHeap([4, 2, 6]);
  a.meldHeap(b);
  assert.equal(b.size, 0);
  const out: number[] = [];
  while (!a.isEmpty()) out.push(a.extractMin()!);
  assert.deepEqual(out, [1, 2, 3, 4, 5, 6]);
});

test('PairingHeap 重复元素', () => {
  const h = pairingHeap([3, 1, 3, 1, 2]);
  const out: number[] = [];
  while (!h.isEmpty()) out.push(h.extractMin()!);
  assert.deepEqual(out, [1, 1, 2, 3, 3]);
});

test('PairingHeap 钩子被调用', () => {
  let melds = 0;
  let inserts = 0;
  let extracts = 0;
  let pairPass = 0;
  const hooks: PairingHooks = {
    onMeld: () => melds++,
    onInsert: () => inserts++,
    onExtract: () => extracts++,
    onPairPass: () => pairPass++,
  };
  const h = pairingHeap([1, 2, 3, 4], hooks);
  assert.equal(inserts, 4);
  assert.ok(melds > 0);
  h.extractMin(hooks); // 触发配对 pass
  assert.ok(pairPass > 0, 'extractMin 应触发配对 pass');
  assert.ok(extracts > 0);
});

test('PairingHeap 大量随机操作正确性', () => {
  const h = new PairingHeap();
  const ref: number[] = [];
  for (let i = 0; i < 80; i++) {
    const v = (i * 23 + 5) % 103;
    h.insert(v);
    ref.push(v);
  }
  ref.sort((a, b) => a - b);
  const out: number[] = [];
  while (!h.isEmpty()) out.push(h.extractMin()!);
  assert.deepEqual(out, ref);
});
