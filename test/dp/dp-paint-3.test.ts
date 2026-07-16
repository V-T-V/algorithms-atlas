import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paintHouse } from '../../src/algorithms/dp/dp-paint-3/impl.ts';

test('paint 经典', () => {
  assert.equal(
    paintHouse([
      [17, 2, 17],
      [16, 16, 5],
      [14, 3, 19],
    ]),
    10,
  );
});
test('paint 单房', () => {
  assert.equal(paintHouse([[5, 9, 1]]), 1);
});
test('paint 空', () => {
  assert.equal(paintHouse([]), 0);
});
