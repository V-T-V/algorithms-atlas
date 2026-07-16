import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulateBarrier2 } from '../../src/algorithms/concurrency/conc-barrier-2/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-barrier-2/trace.ts';

test('barrier v2 第 n 个触发放行', () => {
  const steps = simulateBarrier2(3, [
    { thread: 0, action: 'arrive' },
    { thread: 1, action: 'arrive' },
    { thread: 2, action: 'arrive' },
  ]);
  assert.equal(steps[2]!.arrived, 0); // 放行后归零
  assert.equal(steps[2]!.generation, 1);
});
test('barrier v2 trace 非空', () => assert.ok(buildTrace().length > 0));
