import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fareySequence, fareyLength } from '../../src/algorithms/math/farey-sequence/impl.ts';

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

test('farey F_5 标准序列', () => {
  const seq = fareySequence(5);
  const expected: Array<[number, number]> = [
    [0, 1],
    [1, 5],
    [1, 4],
    [1, 3],
    [2, 5],
    [1, 2],
    [3, 5],
    [2, 3],
    [3, 4],
    [4, 5],
    [1, 1],
  ];
  assert.deepEqual(seq, expected);
});

test('farey 升序', () => {
  for (const n of [4, 6, 8, 10]) {
    const seq = fareySequence(n);
    for (let i = 1; i < seq.length; i++) {
      const prev = seq[i - 1]![0]! / seq[i - 1]![1]!;
      const cur = seq[i]![0]! / seq[i]![1]!;
      assert.ok(prev <= cur + 1e-12, `n=${n} 第 ${i} 项应升序`);
    }
  }
});

test('farey 既约', () => {
  for (const n of [5, 8, 12]) {
    const seq = fareySequence(n);
    for (const [a, b] of seq) {
      assert.equal(gcd(a, b), 1, `${a}/${b} 应既约`);
    }
  }
});

test('farey 起止为 0/1 与 1/1', () => {
  for (const n of [1, 3, 7]) {
    const seq = fareySequence(n);
    assert.deepEqual(seq[0], [0, 1]);
    assert.deepEqual(seq[seq.length - 1], [1, 1]);
  }
});

test('farey 长度公式', () => {
  for (const n of [1, 5, 10]) {
    assert.equal(fareySequence(n).length, fareyLength(n));
  }
});

test('farey n<1 空', () => {
  assert.deepEqual(fareySequence(0), []);
});

test('farey 钩子', () => {
  let terms = 0;
  fareySequence(4, { onTerm: () => terms++ });
  assert.ok(terms > 0);
});
