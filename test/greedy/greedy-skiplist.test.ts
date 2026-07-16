import { test } from 'node:test';
import assert from 'node:assert/strict';
import { skiplistGreedy } from '../../src/algorithms/greedy/greedy-skiplist/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-skiplist/trace.ts';
test('跳表分层非负', () => {
  let s = 1;
  const r = skiplistGreedy(20, 0.5, () => {
    s = (s * 9 + 7) % 100;
    return s / 100;
  });
  assert.ok(r.levels.every((l) => l >= 0));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
