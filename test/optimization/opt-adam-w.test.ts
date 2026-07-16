import { test } from 'node:test';
import assert from 'node:assert/strict';
import { optAdamW, demoFunc, demoGrad } from '../../src/algorithms/optimization/opt-adam-w/impl.ts';

test('opt-adam-w 收敛到 (3,-1)', () => {
  // 关闭权重衰减以验证 Adam 更新本身能到最优；权重衰减是正则项，会偏离最优点
  const r = optAdamW(demoFunc, demoGrad, [0, 0], { lr: 0.1, wd: 0, maxIter: 500, tol: 1e-8 });
  assert.ok(r.converged);
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-2, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-2, `y=${r.params[1]}`);
});

test('opt-adam-w 目标值趋近 0', () => {
  const r = optAdamW(demoFunc, demoGrad, [0, 0], { lr: 0.1, wd: 0, maxIter: 500, tol: 1e-10 });
  assert.ok(r.value < 1e-4, `value=${r.value}`);
});

test('opt-adam-w 带权重衰减时参数被拉向 0', () => {
  // wd>0 时解偏离 (3,-1)（朝原点收缩），但仍小于初始值
  const r = optAdamW(demoFunc, demoGrad, [0, 0], { lr: 0.1, wd: 0.1, maxIter: 500, tol: 1e-10 });
  assert.ok(r.params[0]! < 3, `x should shrink toward 0, got ${r.params[0]}`);
  assert.ok(r.value < 1.0, `value=${r.value}`);
});
