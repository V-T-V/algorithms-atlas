import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isBipartite } from '../../src/algorithms/graph/graph-is-bipartite/impl.ts';

test('is-bipartite LeetCode 785 例 1', () => {
  assert.equal(
    isBipartite([
      [1, 3],
      [0, 2],
      [1, 3],
      [0, 2],
    ]),
    true,
  );
});

test('is-bipartite LeetCode 785 例 2', () => {
  assert.equal(
    isBipartite([
      [1, 2, 3],
      [0, 2],
      [0, 1, 3],
      [0, 2],
    ]),
    false,
  );
});

test('is-bipartite 单节点', () => {
  assert.equal(isBipartite([[]]), true);
});

test('is-bipartite 三角形非二分', () => {
  assert.equal(
    isBipartite([
      [1, 2],
      [0, 2],
      [0, 1],
    ]),
    false,
  );
});

test('is-bipartite 钩子', () => {
  let colors = 0;
  isBipartite(
    [
      [1, 3],
      [0, 2],
      [1, 3],
      [0, 2],
    ],
    { onColor: () => colors++ },
  );
  assert.equal(colors, 4);
});
