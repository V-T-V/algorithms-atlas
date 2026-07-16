import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateSavages } from '../../src/algorithms/concurrency/conc-dining-savages/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-dining-savages/trace.ts';

test('conc-dining-savages 锅空触发填满', () => {
  const steps = simulateSavages(2, 1, 3);
  const events = steps.map((s) => s.event);
  assert.ok(events.includes('wake-cook'));
  assert.ok(events.includes('refill'));
  assert.equal(steps[steps.length - 1]!.totalEaten, 3);
});

test('conc-dining-savages 补充次数正确', () => {
  // capacity 2, eat 5 -> 需要补充
  const steps = simulateSavages(2, 2, 5);
  assert.ok(steps[steps.length - 1]!.refills >= 1);
});

test('conc-dining-savages trace', () => {
  assert.ok(buildTrace().length > 2);
});
