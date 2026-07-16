import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  matchingHopcroft,
  type BipartiteInput,
} from '../../src/algorithms/graph/matching-hopcroft/impl.ts';

/** 校验匹配合法：无两条边共享端点。 */
function isValidMatching(r: ReturnType<typeof matchingHopcroft>): boolean {
  const seenR = new Set<string>();
  for (const [u, v] of r.matchLeft) {
    if (seenR.has(v)) return false;
    seenR.add(v);
    if (r.matchRight.get(v) !== u) return false;
  }
  return r.matchLeft.size === r.size;
}

const G: BipartiteInput = {
  left: ['L0', 'L1', 'L2', 'L3'],
  right: ['R0', 'R1', 'R2', 'R3'],
  edges: [
    { left: 'L0', right: 'R0' },
    { left: 'L0', right: 'R1' },
    { left: 'L1', right: 'R0' },
    { left: 'L1', right: 'R2' },
    { left: 'L2', right: 'R1' },
    { left: 'L2', right: 'R3' },
    { left: 'L3', right: 'R2' },
    { left: 'L3', right: 'R3' },
  ],
};

test('matching-hopcroft 完美匹配大小为 4', () => {
  const r = matchingHopcroft(G);
  assert.equal(r.size, 4);
  assert.ok(isValidMatching(r), '匹配应合法');
});

test('matching-hopcroft 非完美匹配（瓶颈在左部）', () => {
  // 3 个左点只连到 2 个右点 → 最大匹配 = 2
  const g: BipartiteInput = {
    left: ['A', 'B', 'C'],
    right: ['X', 'Y'],
    edges: [
      { left: 'A', right: 'X' },
      { left: 'B', right: 'X' },
      { left: 'C', right: 'Y' },
    ],
  };
  const r = matchingHopcroft(g);
  assert.equal(r.size, 2);
  assert.ok(isValidMatching(r));
});

test('matching-hopcroft 需要增广路（经典示例）', () => {
  // L0-R0, L1-R0, L1-R1：贪心可能先匹配 L0-R0，再需增广 L1-R0→L0-R1
  const g: BipartiteInput = {
    left: ['L0', 'L1'],
    right: ['R0', 'R1'],
    edges: [
      { left: 'L0', right: 'R0' },
      { left: 'L1', right: 'R0' },
      { left: 'L1', right: 'R1' },
    ],
  };
  const r = matchingHopcroft(g);
  assert.equal(r.size, 2);
  assert.ok(isValidMatching(r));
});

test('matching-hopcroft 无边时匹配为 0', () => {
  const g: BipartiteInput = {
    left: ['A', 'B'],
    right: ['X', 'Y'],
    edges: [],
  };
  assert.equal(matchingHopcroft(g).size, 0);
});

test('matching-hopcroft 空图', () => {
  assert.equal(matchingHopcroft({ left: [], right: [], edges: [] }).size, 0);
});

test('matching-hopcroft 单条边', () => {
  const r = matchingHopcroft({
    left: ['A'],
    right: ['X'],
    edges: [{ left: 'A', right: 'X' }],
  });
  assert.equal(r.size, 1);
  assert.equal(r.matchLeft.get('A'), 'X');
});

test('matching-hopcroft 钩子被调用', () => {
  let phases = 0;
  let matches = 0;
  let doneSize = -1;
  matchingHopcroft(G, {
    onPhase: () => phases++,
    onMatch: () => matches++,
    onDone: (s) => {
      doneSize = s;
    },
  });
  assert.ok(phases >= 1, '至少一个阶段');
  assert.ok(matches >= 1, '至少一次匹配');
  assert.equal(doneSize, 4);
  assert.equal(matches, 4, '匹配钩子次数 = 匹配数');
});

test('matching-hopcroft 大小不超过 min(|U|,|V|)', () => {
  const r = matchingHopcroft(G);
  assert.ok(r.size <= Math.min(G.left.length, G.right.length));
});
