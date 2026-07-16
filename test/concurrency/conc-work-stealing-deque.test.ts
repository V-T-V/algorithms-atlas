import { test } from 'node:test';
import assert from 'node:assert/strict';
import { workStealingDeque } from '../../src/algorithms/concurrency/conc-work-stealing-deque/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-work-stealing-deque/trace.ts';
test('ws steal 后目标有任务', () => {
  const ws = [{ deq: [1, 2] }, { deq: [] }];
  workStealingDeque(ws, [{ op: 'steal', from: 0, to: 1 }]);
  assert.equal(ws[1]!.deq.length, 1);
});
test('ws trace 非空', () => assert.ok(buildTrace().length >= 2));
