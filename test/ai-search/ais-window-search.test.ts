import { test } from 'node:test';
import assert from 'node:assert/strict';
import { windowSearch, type WNode } from '../../src/algorithms/ai-search/ais-window-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-window-search/trace.ts';

test('window search 命中窗口（单叶）', () => {
  const t: WNode = { id: 'r', utility: 5 };
  assert.equal(windowSearch(t, 5, 3, 1), 5);
});
test('window search fail-high 回退正确', () => {
  const t: WNode = { id: 'r', utility: 100 };
  assert.equal(windowSearch(t, 0, 5, 1), 100);
});
test('window search 多层树正确', () => {
  // negamax depth=2：根=max(-max(-3,-9), -max(-5,-2)) = max(3, 2) = 3
  const t: WNode = {
    id: 'r',
    children: [
      {
        id: 'a',
        children: [
          { id: 'a1', utility: 3 },
          { id: 'a2', utility: 9 },
        ],
      },
      {
        id: 'b',
        children: [
          { id: 'b1', utility: 5 },
          { id: 'b2', utility: 2 },
        ],
      },
    ],
  };
  assert.equal(windowSearch(t, 3, 5, 2), 3);
});
test('window search trace 非空', () => assert.ok(buildTrace().length > 0));
