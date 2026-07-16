import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vacation } from '../../src/algorithms/dp/dp-vacation/impl.ts';

test('vacation 简单三选一', () => {
  const h = [
    [10, 40, 70],
    [20, 50, 80],
    [30, 60, 90],
  ];
  const { total, plan } = vacation(h);
  // 贪心选每天最大但相邻不能重复：d0 a2(70), d1 a2 不能选 → a1(50) 或 a0? 选 a1, d2 a2(90)? 不能与 d1 a1 重复? 可以选 a2
  // 方案 a2,a1,a2 = 70+50+90=210
  assert.equal(total, 210);
  assert.equal(plan.length, 3);
  // 验证相邻不重复
  for (let i = 1; i < plan.length; i++) {
    assert.notEqual(plan[i], plan[i - 1]);
  }
});

test('vacation 单天', () => {
  const { total, plan } = vacation([[5, 9, 3]]);
  assert.equal(total, 9);
  assert.equal(plan[0], 1);
});

test('vacation 空输入', () => {
  assert.equal(vacation([]).total, 0);
});

test('vacation 方案合法（验证总和价值）', () => {
  const h = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12],
  ];
  const { total, plan } = vacation(h);
  let sum = 0;
  for (let i = 0; i < h.length; i++) sum += h[i]![plan[i]!]!;
  assert.equal(sum, total);
  for (let i = 1; i < plan.length; i++) assert.notEqual(plan[i], plan[i - 1]);
});

test('vacation 钩子', () => {
  let days = 0;
  vacation(
    [
      [1, 2, 3],
      [4, 5, 6],
    ],
    { onDay: () => days++ },
  );
  assert.equal(days, 2);
});
