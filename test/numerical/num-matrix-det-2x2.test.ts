import { test } from 'node:test';
import assert from 'node:assert/strict';
import { det2x2 } from '../../src/algorithms/numerical/num-matrix-det-2x2/impl.ts';
test('2×2 行列式', () => {
  assert.equal(
    det2x2([
      [1, 2],
      [3, 4],
    ]),
    -2,
  );
});
