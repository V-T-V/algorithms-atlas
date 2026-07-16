import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateResourceHierarchy } from '../../src/algorithms/concurrency/conc-philosophers-resource-hierarchy/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-philosophers-resource-hierarchy/trace.ts';

test('conc-philosophers-resource-hierarchy 取叉顺序先小后大', () => {
  const steps = simulateResourceHierarchy(5, [{ philosopher: 1, action: 'dine' }]);
  const o = steps[0]!.order[1]!;
  assert.equal(o.first, 1);
  assert.equal(o.second, 2);
});

test('conc-philosophers-resource-hierarchy 最后一哲学家环绕', () => {
  const steps = simulateResourceHierarchy(5, [{ philosopher: 4, action: 'dine' }]);
  const o = steps[0]!.order[4]!;
  assert.equal(o.first, 0); // F0 < F4
  assert.equal(o.second, 4);
});

test('conc-philosophers-resource-hierarchy 两非邻接可同时进餐', () => {
  const steps = simulateResourceHierarchy(5, [
    { philosopher: 0, action: 'dine' },
    { philosopher: 2, action: 'dine' },
  ]);
  assert.deepEqual(steps[1]!.eating, [0, 2]);
});

test('conc-philosophers-resource-hierarchy trace', () => {
  assert.ok(buildTrace().length > 2);
});
