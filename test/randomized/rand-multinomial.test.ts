import { test } from 'node:test';
import assert from 'node:assert/strict';
import { multinomialSample } from '../../src/algorithms/randomized/rand-multinomial/impl.ts';
test('总数为 n', () => {
  const c = multinomialSample([0.2, 0.3, 0.5], 100, 42);
  assert.equal(
    c.reduce((a, b) => a + b, 0),
    100,
  );
});
test('长度匹配', () => {
  assert.equal(multinomialSample([0.5, 0.5], 10, 1).length, 2);
});
