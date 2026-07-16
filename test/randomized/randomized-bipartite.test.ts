// Randomized Bipartite Matching · 单元测试

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  greedyMatching,
  augmentMatching,
  makeRng,
  makeSampleGraph,
  maxMatchingExact,
  shuffle,
  type BipartiteGraph,
} from '../../src/algorithms/randomized/randomized-bipartite/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/randomized/randomized-bipartite/trace.ts';

test('randomized-bipartite 示例图最大匹配 = 4', () => {
  // 示例图含完美匹配：L0-R0, L1-R2, L2-R1, L3-R3
  const g = makeSampleGraph();
  assert.equal(maxMatchingExact(g), 4);
});

test('greedy 匹配大小 ≤ 最大匹配', () => {
  const g = makeSampleGraph();
  const max = maxMatchingExact(g);
  const m = greedyMatching(g, makeRng(42));
  assert.ok(m.size <= max, `greedy ${m.size} 应 ≤ 最大 ${max}`);
});

test('greedy 匹配大小 ≥ 最大匹配 / 2（1/2 近似）', () => {
  const g = makeSampleGraph();
  const max = maxMatchingExact(g);
  const m = greedyMatching(g, makeRng(42));
  assert.ok(m.size * 2 >= max, `greedy ${m.size} 应 ≥ 最大 ${max}/2`);
});

test('greedy 匹配是合法的（每个点至多出现一次）', () => {
  const g = makeSampleGraph();
  const m = greedyMatching(g, makeRng(7));
  const seenL = new Set<number>();
  const seenR = new Set<number>();
  for (const e of m.edges) {
    assert.ok(!seenL.has(e.u), `L${e.u} 重复匹配`);
    assert.ok(!seenR.has(e.v), `R${e.v} 重复匹配`);
    seenL.add(e.u);
    seenR.add(e.v);
    // 边必须在图中
    assert.ok(g.adj[e.u]!.includes(e.v), `L${e.u}-R${e.v} 不在图中`);
  }
});

test('augment 匹配达到最大匹配（Las Vegas 性质）', () => {
  const g = makeSampleGraph();
  const max = maxMatchingExact(g);
  // 多轮增广应达到最大
  const m = augmentMatching(g, makeRng(42), 5);
  assert.equal(m.size, max, `augment ${m.size} 应等于最大 ${max}`);
});

test('augment 匹配合法', () => {
  const g = makeSampleGraph();
  const m = augmentMatching(g, makeRng(1), 5);
  const seenL = new Set<number>();
  const seenR = new Set<number>();
  for (const e of m.edges) {
    assert.ok(!seenL.has(e.u));
    assert.ok(!seenR.has(e.v));
    seenL.add(e.u);
    seenR.add(e.v);
    assert.ok(g.adj[e.u]!.includes(e.v));
  }
});

test('augment matchL/matchR 一致', () => {
  const g = makeSampleGraph();
  const m = augmentMatching(g, makeRng(99), 5);
  let count = 0;
  for (let u = 0; u < g.left; u++) {
    const v = m.matchL[u]!;
    if (v >= 0) {
      count++;
      assert.equal(m.matchR[v]!, u, `matchR[R${v}] 应为 L${u}`);
    }
  }
  assert.equal(count, m.size);
});

test('shuffle 是置换', () => {
  const rng = makeRng(3);
  const arr = [0, 1, 2, 3, 4, 5, 6, 7];
  const before = [...arr];
  shuffle(arr, rng);
  assert.deepEqual(
    [...arr].sort((a, b) => a - b),
    before,
  );
});

test('greedy 多种子一致性：贪心大小在多种子下稳定（≤ 最大）', () => {
  const g = makeSampleGraph();
  const max = maxMatchingExact(g);
  for (let s = 1; s <= 10; s++) {
    const m = greedyMatching(g, makeRng(s));
    assert.ok(m.size >= 1, `种子 ${s} 应至少匹配 1 条`);
    assert.ok(m.size <= max);
  }
});

test('空图（无边）匹配为 0', () => {
  const g: BipartiteGraph = { left: 3, right: 3, adj: [[], [], []] };
  assert.equal(greedyMatching(g, makeRng(1)).size, 0);
  assert.equal(augmentMatching(g, makeRng(1), 3).size, 0);
});

test('完全二分图 K_{3,3} 最大匹配 = 3', () => {
  const g: BipartiteGraph = {
    left: 3,
    right: 3,
    adj: [
      [0, 1, 2],
      [0, 1, 2],
      [0, 1, 2],
    ],
  };
  assert.equal(maxMatchingExact(g), 3);
  assert.equal(augmentMatching(g, makeRng(42), 5).size, 3);
});

test('greedy 钩子完整触发', () => {
  const g = makeSampleGraph();
  const taken: Array<[number, number]> = [];
  greedyMatching(g, makeRng(5), {
    onTake: (u, v) => taken.push([u, v]),
  });
  assert.ok(taken.length >= 1);
  // 每对在图中
  for (const [u, v] of taken) assert.ok(g.adj[u]!.includes(v));
});

test('augment 钩子 onRound 触发', () => {
  const g = makeSampleGraph();
  const rounds: number[] = [];
  augmentMatching(g, makeRng(8), 3, {
    onRound: (r) => rounds.push(r),
  });
  // 达到最大匹配后会早停，所以轮数 ≤ 3 但至少 1 轮
  assert.ok(rounds.length >= 1, `至少 1 轮，实际 ${rounds.length}`);
  assert.ok(rounds.length <= 3, `至多 3 轮，实际 ${rounds.length}`);
});

test('buildTrace augment 模式生成至少 5 帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 5, `帧数 ${frames.length} 应 >= 5`);
});

test('buildTrace greedy 模式生成帧', () => {
  const frames = buildTrace({ mode: 'greedy' });
  assert.ok(frames.length >= 3);
});

test('DEFAULT_INPUT 配置正确', () => {
  assert.equal(DEFAULT_INPUT.seed, 42);
  assert.equal(DEFAULT_INPUT.mode, 'augment');
  assert.equal(DEFAULT_INPUT.graph.left, 4);
});
