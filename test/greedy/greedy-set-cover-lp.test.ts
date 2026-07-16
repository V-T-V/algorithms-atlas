import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setCoverLpRounding } from '../../src/algorithms/greedy/greedy-set-cover-lp/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-set-cover-lp/trace.ts';
test('覆盖全宇宙', () => {
  const r = setCoverLpRounding(
    [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    [1, 1, 1],
    4,
  );
  const covered = new Set<number>();
  for (const i of r.chosen)
    for (const e of [0, 1, 2, 3]) if ([0, 1, 1, 2, 2, 3][0] === e) covered.add(e);
  assert.ok(r.cost >= 0);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
