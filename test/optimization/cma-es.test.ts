import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cmaEs, demoFunc, demoBounds } from '../../src/algorithms/optimization/cma-es/impl.ts';

test('cma-es 收敛到全局最优 (3,-1)', () => {
  const r = cmaEs(demoFunc, demoBounds, {
    sigma0: 3,
    lambda: 8,
    maxGen: 400,
    tol: 1e-12,
    seed: 42,
  });
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-4, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-4, `y=${r.params[1]}`);
});

test('cma-es 目标值趋近 0', () => {
  const r = cmaEs(demoFunc, demoBounds, { maxGen: 400, tol: 1e-14, seed: 7 });
  assert.ok(r.value < 1e-10, `value=${r.value}`);
});

test('cma-es 不同种子都收敛', () => {
  for (const seed of [1, 7, 42, 99, 123]) {
    const r = cmaEs(demoFunc, demoBounds, { maxGen: 400, tol: 1e-10, seed });
    assert.ok(Math.abs(r.params[0]! - 3) < 1e-3, `seed=${seed} x=${r.params[0]}`);
    assert.ok(Math.abs(r.params[1]! + 1) < 1e-3, `seed=${seed} y=${r.params[1]}`);
  }
});

test('cma-es 步数合理（凸问题几十代）', () => {
  const r = cmaEs(demoFunc, demoBounds, { maxGen: 400, tol: 1e-12, seed: 42 });
  assert.ok(r.generations <= 200, `generations=${r.generations}`);
});

test('cma-es 钩子被调用', () => {
  let gens = 0;
  cmaEs(demoFunc, demoBounds, { maxGen: 30 }, { onGeneration: () => gens++ });
  assert.ok(gens > 0 && gens <= 30);
});
