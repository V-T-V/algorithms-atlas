import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boundedBufferSem } from '../../src/algorithms/concurrency/conc-bounded-buffer-sem/impl.ts';
import { buildTrace } from '../../src/algorithms/concurrency/conc-bounded-buffer-sem/trace.ts';
test('bb 消费后缓冲减少', () => {
  const { buffer } = boundedBufferSem(2, [{ op: 'p', v: 1 }, { op: 'p', v: 2 }, { op: 'c' }]);
  assert.equal(buffer.length, 1);
});
test('bb trace 非空', () => assert.ok(buildTrace().length >= 2));
