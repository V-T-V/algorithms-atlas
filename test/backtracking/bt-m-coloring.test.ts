import { test } from 'node:test';
import assert from 'node:assert/strict';
import { graphColoring } from '../../src/algorithms/backtracking/bt-m-coloring/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-m-coloring/trace.ts';
test('graphColoring 正确', () => {
  assert.equal(
    graphColoring(
      4,
      [
        [0, 1],
        [0, 2],
        [1, 2],
        [1, 3],
      ],
      3,
    ),
    true,
  );
  assert.equal(
    graphColoring(
      3,
      [
        [0, 1],
        [1, 2],
        [2, 0],
      ],
      2,
    ),
    false,
  );
});
test('buildTrace 有帧', () => {
  assert.ok(buildTrace().length >= 2);
});
