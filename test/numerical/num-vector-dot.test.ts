import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vDot } from '../../src/algorithms/numerical/num-vector-dot/impl.ts';
test('点积', () => {
  assert.equal(vDot([1, 2, 3], [4, 5, 6]), 32);
});
