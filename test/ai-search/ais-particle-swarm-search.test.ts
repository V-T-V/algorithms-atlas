import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pso, sphere } from '../../src/algorithms/ai-search/ais-particle-swarm-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-particle-swarm-search/trace.ts';

test('PSO 在 sphere 上收敛', () => {
  const r = pso(2, 20, 50, 0.7, 1.5, 1.5, 11);
  assert.ok(r.gfit < 1, 'gfit=' + r.gfit);
});
test('sphere(0)=0', () => assert.equal(sphere([0, 0, 0]), 0));
test('PSO 同种子可复现', () => {
  const a = pso(2, 10, 20, 0.7, 1.5, 1.5, 5);
  const b = pso(2, 10, 20, 0.7, 1.5, 1.5, 5);
  assert.deepEqual(a.gbest, b.gbest);
});
test('PSO trace 非空', () => assert.ok(buildTrace().length > 0));
