import { test } from 'node:test';
import assert from 'node:assert/strict';
import { particleSwarm } from '../../src/algorithms/optimization/opt-particle-swarm-2/impl.ts';
import { buildTrace } from '../../src/algorithms/optimization/opt-particle-swarm-2/trace.ts';
test('PSO 接近 0', () => {
  const r = particleSwarm((x) => x[0]! * x[0]! + x[1]! * x[1]!, 2, 20, 50);
  assert.ok(r.gFit < 5);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
