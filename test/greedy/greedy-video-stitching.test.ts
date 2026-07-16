import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyVideoStitching } from '../../src/algorithms/greedy/greedy-video-stitching/impl.ts';

test('greedy-video-stitching 经典用例 = 3', () => {
  assert.equal(
    greedyVideoStitching(
      [
        [0, 2],
        [4, 6],
        [8, 10],
        [1, 9],
        [1, 5],
        [5, 9],
      ],
      10,
    ),
    3,
  );
});

test('greedy-video-stitching 无法覆盖 = -1', () => {
  assert.equal(
    greedyVideoStitching(
      [
        [0, 1],
        [1, 2],
      ],
      5,
    ),
    -1,
  );
});

test('greedy-video-stitching 单段覆盖', () => {
  assert.equal(greedyVideoStitching([[0, 5]], 5), 1);
});
