import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lucas, combBig } from '../../src/algorithms/math/lucas/impl.ts';

test('lucas 小情形直接对比 BigInt', () => {
  for (const [n, m, p] of [
    [5, 2, 7],
    [10, 3, 11],
    [10, 3, 13],
    [20, 5, 7],
    [6, 4, 5],
  ] as const) {
    const expected = Number(combBig(n, m) % BigInt(p));
    assert.equal(lucas(n, m, p), expected, `C(${n},${m}) mod ${p}`);
  }
});

test('lucas 经典 C(10,3)=120', () => {
  // 120 mod 7 = 1；120 mod 11 = 10；120 mod 13 = 3
  assert.equal(lucas(10, 3, 7), 120 % 7);
  assert.equal(lucas(10, 3, 11), 120 % 11);
  assert.equal(lucas(10, 3, 13), 120 % 13);
});

test('lucas m=0 或 m=n', () => {
  assert.equal(lucas(100, 0, 5), 1);
  assert.equal(lucas(50, 50, 7), 1);
});

test('lucas m>n 返回 0', () => {
  assert.equal(lucas(3, 5, 7), 0);
});

test('lucas 含 0 中间位（某 m_i > n_i）', () => {
  // n=8, m=2, p=5：n=13_5, m=02_5 → C(1,0)·C(3,2)=1·3=3
  // 实际 C(8,2)=28 mod 5 = 3 ✓
  assert.equal(lucas(8, 2, 5), 3);
  // 构造 m_i > n_i 的情形：n=5=10_5, m=5 但取 m=7 → 整体 0
  assert.equal(lucas(5, 7, 5), 0);
});

test('lucas 大组合数与 BigInt 一致', () => {
  for (const [n, m, p] of [
    [100, 30, 5],
    [200, 50, 97],
    [1000, 17, 13],
    [50, 25, 3],
  ] as const) {
    const expected = Number(combBig(n, m) % BigInt(p));
    assert.equal(lucas(n, m, p), expected, `C(${n},${m}) mod ${p}`);
  }
});

test('lucas 非素数 p 抛错', () => {
  assert.throws(() => lucas(10, 3, 4), RangeError);
  assert.throws(() => lucas(10, 3, 1), RangeError);
});

test('lucas 钩子被调用', () => {
  let digits = 0;
  let combs = 0;
  let done = 0;
  lucas(100, 30, 5, {
    onDigit: () => digits++,
    onComb: () => combs++,
    onDone: () => done++,
  });
  assert.ok(digits >= 1, '至少分解一位');
  assert.ok(combs >= 1);
  assert.equal(done, 1);
});
