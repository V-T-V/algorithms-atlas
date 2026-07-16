import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gcd, gcdRecursive, extGcd } from '../../src/algorithms/math/gcd/impl.ts';

test('gcd 基本行为', () => {
  assert.equal(gcd(0, 0), 0);
  assert.equal(gcd(0, 5), 5);
  assert.equal(gcd(5, 0), 5);
});

test('gcd 经典用例', () => {
  assert.equal(gcd(252, 105), 21);
  assert.equal(gcd(1071, 462), 21);
  assert.equal(gcd(48, 18), 6);
  assert.equal(gcd(17, 5), 1); // 互素
});

test('gcd 处理负数（取绝对值）', () => {
  assert.equal(gcd(-252, 105), 21);
  assert.equal(gcd(252, -105), 21);
  assert.equal(gcd(-252, -105), 21);
});

test('gcd 迭代与递归一致', () => {
  for (const [a, b] of [
    [252, 105],
    [1071, 462],
    [17, 5],
    [0, 9],
    [9, 0],
  ] as const) {
    assert.equal(gcd(a, b), gcdRecursive(a, b), `mismatch at (${a},${b})`);
  }
});

test('extGcd 满足 Bézout 恒等式', () => {
  const { g, x, y } = extGcd(252, 105);
  assert.equal(g, 21);
  assert.equal(252 * x + 105 * y, g);

  const r2 = extGcd(1071, 462);
  assert.equal(r2.g, 21);
  assert.equal(1071 * r2.x + 462 * r2.y, r2.g);
});

test('gcd 钩子被调用', () => {
  let steps = 0;
  let done = 0;
  gcd(252, 105, {
    onStep: () => steps++,
    onDone: () => done++,
  });
  assert.ok(steps >= 1, '应至少一轮取模');
  assert.equal(done, 1, 'onDone 恰好调用一次');
});
