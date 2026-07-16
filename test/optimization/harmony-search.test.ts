import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  harmonySearch,
  demoFunc,
  demoBounds,
} from '../../src/algorithms/optimization/harmony-search/impl.ts';

test('harmony-search 收敛到 (3,-1)', () => {
  const r = harmonySearch(demoFunc, demoBounds, {
    HMS: 30,
    HMCR: 0.9,
    PAR: 0.3,
    maxIter: 5000,
    tol: 1e-10,
    seed: 42,
  });
  assert.ok(Math.abs(r.params[0]! - 3) < 1e-2, `x=${r.params[0]}`);
  assert.ok(Math.abs(r.params[1]! + 1) < 1e-2, `y=${r.params[1]}`);
});

test('harmony-search 目标值趋近 0', () => {
  const r = harmonySearch(demoFunc, demoBounds, { maxIter: 8000, tol: 1e-12, seed: 7 });
  assert.ok(r.value < 1e-4, `value=${r.value}`);
});

test('harmony-search 结果可复现（同种子）', () => {
  const a = harmonySearch(demoFunc, demoBounds, { maxIter: 500, seed: 123 });
  const b = harmonySearch(demoFunc, demoBounds, { maxIter: 500, seed: 123 });
  assert.deepEqual(a.params, b.params);
});

test('harmony-search 钩子被调用', () => {
  let calls = 0;
  harmonySearch(demoFunc, demoBounds, { maxIter: 100 }, { onImprovise: () => calls++ });
  assert.ok(calls > 0 && calls <= 100);
});
