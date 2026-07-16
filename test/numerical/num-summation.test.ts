import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summation } from '../../src/algorithms/numerical/num-summation/impl.ts';
test('1+2+3+4+5=15', () => {
  assert.equal(
    summation((i) => i + 1, 5),
    15,
  );
});
