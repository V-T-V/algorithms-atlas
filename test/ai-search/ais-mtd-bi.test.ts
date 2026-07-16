import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mtdBi, type BiNode } from '../../src/algorithms/ai-search/ais-mtd-bi/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-mtd-bi/trace.ts';

test('mtd-bi 单叶返回 utility', () => {
  assert.equal(mtdBi({ id: 'r', utility: 5 }, 0, 3), 5);
});
test('mtd-bi 不同猜测收敛一致', () => {
  const t: BiNode = {
    id: 'r',
    children: [
      { id: 'a', utility: 4 },
      { id: 'b', utility: 6 },
    ],
  };
  assert.equal(mtdBi(t, 0, 1), mtdBi(t, 10, 1));
});
test('mtd-bi trace 非空', () => assert.ok(buildTrace().length > 0));
