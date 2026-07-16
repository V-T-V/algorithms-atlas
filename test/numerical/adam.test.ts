import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adam } from '../../src/algorithms/numerical/adam/impl.ts';

test("adam 求 y' = y, y(0)=1（真解 e^t）", () => {
  const r = adam((_t, y) => y, 0, 1, 0.01, 100);
  const final = r.ys[r.ys.length - 1]!;
  const t = r.ts[r.ts.length - 1]!;
  const truth = Math.exp(t);
  // 二阶方法误差应很小
  assert.ok(Math.abs(final - truth) < 0.005, `final=${final} truth=${truth}`);
});

test('adam 线性函数精确（f=1 -> y=t）', () => {
  const r = adam(() => 1, 0, 0, 0.5, 4);
  assert.deepEqual(r.ys, [0, 0.5, 1, 1.5, 2]);
});

test("adam 求 y' = -y（衰减）", () => {
  const r = adam((_t, y) => -y, 0, 1, 0.01, 200);
  const final = r.ys[r.ys.length - 1]!;
  assert.ok(final > 0 && final < 0.2, `final=${final}`);
});

test('adam 比同步长 Euler 更精确', () => {
  // 简单内联 Euler 比较
  const h = 0.05;
  const n = 20;
  const ad = adam((_t, y) => y, 0, 1, h, n);
  let ey = 1;
  for (let i = 0; i < n; i++) ey = ey + h * ey;
  const truth = Math.exp(h * n);
  const adErr = Math.abs(ad.ys[ad.ys.length - 1]! - truth);
  const euErr = Math.abs(ey - truth);
  assert.ok(adErr < euErr, `Adams 误差 ${adErr} 应 < Euler ${euErr}`);
});

test('adam 钩子被调用 n 次', () => {
  let calls = 0;
  adam(() => 1, 0, 0, 1, 5, { onStep: () => calls++ });
  assert.equal(calls, 5);
});
