import { test } from 'node:test';
import assert from 'node:assert/strict';
import { euler } from '../../src/algorithms/numerical/euler/impl.ts';

test("euler 求 y' = y, y(0)=1（真解 e^t）", () => {
  const r = euler((_t, y) => y, 0, 1, 0.01, 100);
  const final = r.ys[r.ys.length - 1]!;
  const t = r.ts[r.ts.length - 1]!; // 1.0
  const truth = Math.exp(t);
  // 一阶方法误差应较小（h=0.01）
  assert.ok(Math.abs(final - truth) < 0.02, `final=${final} truth=${truth}`);
});

test("euler 求 y' = -y（衰减到 0）", () => {
  const r = euler((_t, y) => -y, 0, 1, 0.01, 200);
  const final = r.ys[r.ys.length - 1]!;
  assert.ok(final > 0 && final < 0.2, `final=${final} 应衰减`);
});

test('euler 线性函数精确（f 为常数）', () => {
  // y' = 1, y(0)=0 -> y=t 精确
  const r = euler(() => 1, 0, 0, 0.5, 4);
  assert.deepEqual(r.ys, [0, 0.5, 1, 1.5, 2]);
  assert.deepEqual(r.ts, [0, 0.5, 1, 1.5, 2]);
});

test('euler 步数正确', () => {
  const r = euler(() => 0, 0, 5, 0.1, 10);
  assert.equal(r.ys.length, 11); // n+1 个节点
  assert.equal(r.steps.length, 10);
  // y 不变（f=0）
  for (const y of r.ys) assert.equal(y, 5);
});

test('euler 钩子被调用 n 次', () => {
  let calls = 0;
  euler(() => 1, 0, 0, 1, 5, { onStep: () => calls++ });
  assert.equal(calls, 5);
});
