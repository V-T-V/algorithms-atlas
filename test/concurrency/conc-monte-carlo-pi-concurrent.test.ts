import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parallelMonteCarloPi,
  mcWorker,
  makeLcg,
} from '../../src/algorithms/concurrency/conc-monte-carlo-pi-concurrent/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-monte-carlo-pi-concurrent/trace.ts';

test('conc-monte-carlo-pi-concurrent 总投点正确', () => {
  const r = parallelMonteCarloPi(4000, 4);
  assert.equal(r.totalThrown, 4000);
  assert.equal(r.perWorker.length, 4);
});

test('conc-monte-carlo-pi-concurrent Pi 估计合理', () => {
  const r = parallelMonteCarloPi(20000, 4, 7);
  assert.ok(r.piEstimate > 2.8 && r.piEstimate < 3.5, `got ${r.piEstimate}`);
});

test('conc-monte-carlo-pi-concurrent 确定性可复现', () => {
  const r1 = parallelMonteCarloPi(1000, 2, 5);
  const r2 = parallelMonteCarloPi(1000, 2, 5);
  assert.equal(r1.totalHits, r2.totalHits);
});

test('conc-monte-carlo-pi-concurrent mcWorker', () => {
  const rng = makeLcg(1);
  const r = mcWorker(0, 100, rng);
  assert.equal(r.thrown, 100);
  assert.ok(r.hits >= 0 && r.hits <= 100);
});

test('conc-monte-carlo-pi-concurrent trace', () => {
  assert.ok(buildTrace().length > 2);
});
