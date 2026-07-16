import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rationalApprox } from '../../src/algorithms/math/rational-approx/impl.ts';

test('rationalApprox π 的著名逼近 355/113', () => {
  const { num, den } = rationalApprox(Math.PI, 200);
  // 355/113 在 q <= 200 下是最优逼近
  assert.equal(num, 355n);
  assert.equal(den, 113n);
});

test('rationalApprox 较小上限 22/7', () => {
  const { num, den } = rationalApprox(Math.PI, 10);
  // q <= 10 下最优为 22/7
  assert.equal(num, 22n);
  assert.equal(den, 7n);
});

test('rationalApprox √2', () => {
  const { num, den } = rationalApprox(Math.SQRT2, 1000);
  // 1393/985 在 q<=1000 下是 √2 的最佳逼近
  assert.equal(num, 1393n);
  assert.equal(den, 985n);
});

test('rationalApprox 整数', () => {
  const { num, den } = rationalApprox(5, 100);
  assert.equal(num, 5n);
  assert.equal(den, 1n);
});

test('rationalApprox 分母不超过上限', () => {
  const { den } = rationalApprox(Math.E, 50);
  assert.ok(den <= 50n, '分母应 ≤ 上限');
});

test('rationalApprox 错误输入', () => {
  assert.throws(() => rationalApprox(1.5, 0), RangeError);
});

test('rationalApprox 钩子被调用', () => {
  let convs = 0;
  let results = 0;
  rationalApprox(Math.PI, 100, {
    onConvergent: () => convs++,
    onResult: () => results++,
  });
  assert.ok(convs >= 1, '应至少产生一个收敛数');
  assert.equal(results, 1, 'onResult 恰好一次');
});
