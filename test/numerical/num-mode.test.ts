import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mode } from '../../src/algorithms/numerical/num-mode/impl.ts';
test('众数', () => {
  assert.deepEqual(mode([1, 2, 2, 3, 3]), [2, 3]);
});
