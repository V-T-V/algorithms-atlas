import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  differentialEvo,
  demoFunc,
  demoBounds,
} from '../../src/algorithms/optimization/differential-evo/impl.ts';

test('differential-evo 找到全局最优 (3,-1)', () => {
  const r = differentialEvo(demoFunc, demoBounds, {
    NP: 20,
    F: 0.7,
    CR: 0.9,
    maxGen: 200,
    tol: 1e-10,
    seed: 42,
  });
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-2, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-2, `y=${r.params[1]}`);
});

test('differential-evo 目标值趋近 0', () => {
  const r = differentialEvo(demoFunc, demoBounds, { NP: 20, maxGen: 300, tol: 1e-12, seed: 7 });
  assert.ok(r.value < 1e-6, `value=${r.value}`);
});

test('differential-evo 结果可复现（同种子）', () => {
  const a = differentialEvo(demoFunc, demoBounds, { NP: 15, maxGen: 50, seed: 123 });
  const b = differentialEvo(demoFunc, demoBounds, { NP: 15, maxGen: 50, seed: 123 });
  assert.deepEqual(a.params, b.params);
});

test('differential-evo 钩子被调用', () => {
  let gens = 0;
  differentialEvo(demoFunc, demoBounds, { NP: 10, maxGen: 20 }, { onGeneration: () => gens++ });
  assert.ok(gens > 0 && gens <= 20);
});
