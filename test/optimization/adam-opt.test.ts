import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adamOpt, demoFunc, demoGrad } from '../../src/algorithms/optimization/adam-opt/impl.ts';

test('adam-opt 收敛到 (3,-1)', () => {
  const r = adamOpt(demoFunc, demoGrad, [0, 0], { lr: 0.5, maxIter: 500, tol: 1e-10 });
  assert.ok(r.converged);
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-3, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-3, `y=${r.params[1]}`);
});

test('adam-opt 目标值趋近 0', () => {
  const r = adamOpt(demoFunc, demoGrad, [0, 0], { lr: 0.5, maxIter: 500, tol: 1e-12 });
  assert.ok(r.value < 1e-6, `value=${r.value}`);
});

test('adam-opt 用默认超参数收敛', () => {
  // Adam 著名默认 β1=0.9, β2=0.999；这里用大 lr 补偿确定性梯度
  const r = adamOpt(demoFunc, demoGrad, [0, 0], {
    lr: 1.0,
    beta1: 0.9,
    beta2: 0.999,
    maxIter: 500,
    tol: 1e-8,
  });
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-2);
});

test('adam-opt 钩子被调用', () => {
  let calls = 0;
  adamOpt(demoFunc, demoGrad, [0, 0], { maxIter: 50 }, { onIter: () => calls++ });
  assert.ok(calls > 0 && calls <= 50);
});
