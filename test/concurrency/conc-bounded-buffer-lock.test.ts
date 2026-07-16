import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateBoundedBuffer } from '../../src/algorithms/concurrency/conc-bounded-buffer-lock/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-bounded-buffer-lock/trace.ts';

test('conc-bounded-buffer-lock 信号量守恒', () => {
  const steps = simulateBoundedBuffer([{ who: 'P' }, { who: 'P' }], 3);
  assert.equal(steps[1]!.empty, 1);
  assert.equal(steps[1]!.full, 2);
});

test('conc-bounded-buffer-lock 生产消费后恢复', () => {
  const steps = simulateBoundedBuffer([{ who: 'P' }, { who: 'C' }], 3);
  assert.equal(steps[1]!.empty, 3);
  assert.equal(steps[1]!.full, 0);
});

test('conc-bounded-buffer-lock trace', () => {
  assert.ok(buildTrace().length > 2);
});
