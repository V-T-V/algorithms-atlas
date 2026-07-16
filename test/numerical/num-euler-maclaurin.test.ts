import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eulerMaclaurin } from '../../src/algorithms/numerical/num-euler-maclaurin/impl.ts';

test('eulerMaclaurin 近似多项式和', () => {
  // Σ_{k=1}^{5} k = 15
  const { total } = eulerMaclaurin((x) => x, 1, 5, 3);
  assert.ok(Math.abs(total - 15) < 0.5);
});

test('eulerMaclaurin 调和数 H_10', () => {
  // H_10 ≈ 2.928968
  const { total } = eulerMaclaurin((x) => 1 / x, 1, 10, 3);
  let direct = 0;
  for (let k = 1; k <= 10; k++) direct += 1 / k;
  assert.ok(Math.abs(total - direct) < 0.05);
});

test('eulerMaclaurin 增加修正项减少误差', () => {
  const f = (x: number): number => 1 / x;
  let direct = 0;
  for (let k = 1; k <= 10; k++) direct += f(k);
  const e0 = eulerMaclaurin(f, 1, 10, 0).total;
  const e3 = eulerMaclaurin(f, 1, 10, 3).total;
  // 带 3 个修正项应更接近真值
  assert.ok(Math.abs(e3 - direct) <= Math.abs(e0 - direct) * 2);
});

test('eulerMaclaurin a > b 抛错', () => {
  assert.throws(() => eulerMaclaurin((_x) => 0, 5, 1), RangeError);
});

test('eulerMaclaurin p 越界抛错', () => {
  assert.throws(() => eulerMaclaurin((_x) => 0, 1, 5, 10), RangeError);
});
