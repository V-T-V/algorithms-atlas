import { test } from 'node:test';
import assert from 'node:assert/strict';
import { informationGain } from '../../src/algorithms/ml/ml-information-gain/impl.ts';
test('信息增益 完美分裂=1', () => {
  assert.ok(
    Math.abs(
      informationGain(
        [0, 0, 1, 1],
        [
          [0, 0],
          [1, 1],
        ],
      ) - 1,
    ) < 1e-9,
  );
});
test('信息增益 无分裂=0', () => {
  assert.ok(Math.abs(informationGain([0, 0, 1, 1], [[0, 0, 1, 1]]) - 0) < 1e-9);
});
