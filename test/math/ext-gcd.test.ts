import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extGcd } from '../../src/algorithms/math/ext-gcd/impl.ts';

test('ext-gcd 基本行为', () => {
  assert.equal(extGcd(0, 0).g, 0);
  assert.equal(extGcd(0, 5).g, 5);
  assert.equal(extGcd(5, 0).g, 5);
});

test('ext-gcd 满足 Bézout 恒等式 ax + by = gcd', () => {
  for (const [a, b] of [
    [252, 105],
    [1071, 462],
    [48, 18],
    [17, 5],
    [240, 46],
    [0, 9],
    [9, 0],
  ] as const) {
    const { g, x, y } = extGcd(a, b);
    assert.equal(a * x + b * y, g, `Bézout failed at (${a},${b})`);
    assert.ok(g >= 0, `gcd 非负 (${a},${b})`);
  }
});

test('ext-gcd gcd 值正确', () => {
  assert.equal(extGcd(252, 105).g, 21);
  assert.equal(extGcd(1071, 462).g, 21);
  assert.equal(extGcd(17, 5).g, 1); // 互素
});

test('ext-gcd 处理负数（gcd 取正，Bézout 仍成立）', () => {
  const r1 = extGcd(-252, 105);
  assert.equal(r1.g, 21);
  assert.equal(-252 * r1.x + 105 * r1.y, 21);

  const r2 = extGcd(252, -105);
  assert.equal(r2.g, 21);
  assert.equal(252 * r2.x + -105 * r2.y, 21);
});

test('ext-gcd 可用于求模逆元', () => {
  // 3 mod 7 的逆元：满足 3·x ≡ 1 (mod 7)
  const { x } = extGcd(3, 7);
  const inv = ((x % 7) + 7) % 7;
  assert.equal((3 * inv) % 7, 1);
  assert.equal(inv, 5);
});

test('ext-gcd 钩子被调用', () => {
  let steps = 0;
  let done = 0;
  const { g } = extGcd(252, 105, {
    onStep: () => steps++,
    onDone: () => done++,
  });
  assert.ok(steps >= 1, '至少一轮取模');
  assert.equal(done, 1, 'onDone 恰好一次');
  assert.equal(g, 21);
});
