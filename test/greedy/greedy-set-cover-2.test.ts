import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedySetCover2 } from '../../src/algorithms/greedy/greedy-set-cover-2/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-set-cover-2/trace.ts';

test('集合覆盖完整覆盖', () => {
  const r = greedySetCover2(
    [0, 1, 2, 3],
    [
      [0, 1],
      [2, 3],
      [1, 2],
    ],
  );
  assert.equal(r.totalCovered, 4);
  assert.ok(r.picked.length <= 2);
});

test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));
