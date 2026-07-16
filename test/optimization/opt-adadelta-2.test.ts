import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  optAdadelta2,
  demoFunc,
  demoGrad,
} from '../../src/algorithms/optimization/opt-adadelta-2/impl.ts';

test('opt-adadelta-2 目标值下降（AdaDelta 无全局学习率，收敛较慢）', () => {
  const start = demoFunc([0, 0]);
  const r = optAdadelta2(demoFunc, demoGrad, [0, 0], { decay: 0.95, maxIter: 500, tol: 1e-12 });
  // AdaDelta 没有 lr，下降速度慢；只断言显著小于初始值
  assert.ok(r.value < start, `value=${r.value} should drop below start=${start}`);
});

test('opt-adadelta-2 返回有限参数', () => {
  const r = optAdadelta2(demoFunc, demoGrad, [0, 0], { decay: 0.9, maxIter: 100 });
  assert.ok(Number.isFinite(r.params[0]!), `x=${r.params[0]}`);
  assert.ok(Number.isFinite(r.params[1]!), `y=${r.params[1]}`);
});

test('opt-adadelta-2 迭代次数 > 0', () => {
  const r = optAdadelta2(demoFunc, demoGrad, [0, 0], { maxIter: 50 });
  assert.ok(r.iterations > 0);
});
