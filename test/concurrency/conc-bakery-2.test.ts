import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateBakery } from '../../src/algorithms/concurrency/conc-bakery-2/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-bakery-2/trace.ts';

test('bakery 取号递增', () => {
  const steps = simulateBakery(3, [
    { thread: 0, action: 'enter' },
    { thread: 1, action: 'enter' },
  ]);
  assert.equal(steps[0]!.tickets[0], 1);
  assert.equal(steps[1]!.tickets[1], 2);
});
test('bakery 首个进入者直接 CS', () => {
  const steps = simulateBakery(2, [{ thread: 0, action: 'enter' }]);
  assert.equal(steps[0]!.inCs[0], true);
});
test('bakery exit 清号', () => {
  const steps = simulateBakery(2, [
    { thread: 0, action: 'enter' },
    { thread: 0, action: 'exit' },
  ]);
  assert.equal(steps[1]!.tickets[0], 0);
});
test('bakery trace 非空', () => assert.ok(buildTrace().length > 0));
