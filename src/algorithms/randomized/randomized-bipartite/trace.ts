// =============================================================================
// 随机化二分图最大匹配 · 录制帧序列
// 用 map 展示左→右匹配映射，aux 展示匹配大小与阶段。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  greedyMatching,
  augmentMatching,
  makeSampleGraph,
  makeRng,
  type BipartiteGraph,
} from './impl.ts';

export const DEFAULT_INPUT = {
  graph: makeSampleGraph(),
  seed: 42,
  rounds: 3,
  /** 使用贪心（'greedy'）还是增广（'augment'）。 */
  mode: 'augment' as 'greedy' | 'augment',
};

interface BuildTraceInput {
  graph?: BipartiteGraph;
  seed?: number;
  rounds?: number;
  mode?: 'greedy' | 'augment';
}

/** 把当前匹配状态录成一帧。 */
function renderMatching(
  rec: TraceRecorder,
  g: BipartiteGraph,
  matchL: Int32Array,
  note: { zh: string; en: string },
  extra?: Array<{ label: string; value: string; role?: BarRole }>,
): void {
  const entries: Array<{ key: string; value: string; role?: BarRole }> = [];
  let matched = 0;
  for (let u = 0; u < g.left; u++) {
    const v = matchL[u]!;
    entries.push({
      key: `L${u}`,
      value: v >= 0 ? `R${v}` : '—',
      role: v >= 0 ? ('final' as BarRole) : ('default' as BarRole),
    });
    if (v >= 0) matched++;
  }
  const aux: Array<{ label: string; value: string; role?: BarRole }> = [
    { label: '已匹配', value: String(matched), role: 'final' as BarRole },
    { label: '左点数', value: String(g.left), role: 'pivot' as BarRole },
    { label: '右点数', value: String(g.right), role: 'pivot' as BarRole },
    ...(extra ?? []),
  ];
  rec.begin(note).setMap(entries).setAux(aux).commit();
}

/** Fisher–Yates 洗牌（与 impl.ts 一致）。 */
function shuffle<T>(arr: T[], rng: () => number): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
}

/** 单轮增广（独立维护状态以录制中间帧）。 */
function oneRoundAugment(
  g: BipartiteGraph,
  matchL: Int32Array,
  matchR: Int32Array,
  rng: () => number,
): void {
  const order = Array.from({ length: g.left }, (_, i) => i);
  shuffle(order, rng);
  for (const u of order) {
    if (matchL[u]! !== -1) continue;
    const visited = new Uint8Array(g.right);
    tryAugmentLocal(u, g, matchL, matchR, visited, rng);
  }
}

function tryAugmentLocal(
  u: number,
  g: BipartiteGraph,
  matchL: Int32Array,
  matchR: Int32Array,
  visited: Uint8Array,
  rng: () => number,
): boolean {
  const neigh = [...g.adj[u]!];
  shuffle(neigh, rng);
  for (const v of neigh) {
    if (visited[v]!) continue;
    visited[v] = 1;
    const w = matchR[v]!;
    if (w === -1) {
      matchL[u] = v;
      matchR[v] = u;
      return true;
    }
    if (tryAugmentLocal(w, g, matchL, matchR, visited, rng)) {
      matchL[u] = v;
      matchR[v] = u;
      return true;
    }
  }
  return false;
}

/** 重放随机贪心逐步展示（独立维护 matchL/matchR）。 */
function replayGreedyForTrace(
  rec: TraceRecorder,
  g: BipartiteGraph,
  matchL: Int32Array,
  matchR: Int32Array,
  seed: number,
): void {
  const rng = makeRng(seed);
  const allEdges: Array<{ u: number; v: number }> = [];
  for (let u = 0; u < g.left; u++) {
    for (const v of g.adj[u]!) allEdges.push({ u, v });
  }
  shuffle(allEdges, rng);
  for (const { u, v } of allEdges) {
    if (matchL[u]! === -1 && matchR[v]! === -1) {
      matchL[u] = v;
      matchR[v] = u;
      renderMatching(
        rec,
        g,
        matchL,
        {
          zh: `贪心选入 L${u}—R${v}`,
          en: `Greedy take L${u}—R${v}`,
        },
        [{ label: '本次', value: `L${u}-R${v}`, role: 'swap' as BarRole }],
      );
    }
  }
}

/** 录制演示帧序列。 */
export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const g = input.graph ?? DEFAULT_INPUT.graph;
  const seed = input.seed ?? DEFAULT_INPUT.seed;
  const rounds = input.rounds ?? DEFAULT_INPUT.rounds;
  const mode = input.mode ?? DEFAULT_INPUT.mode;

  const rec = new TraceRecorder();

  // 初始帧
  renderMatching(
    rec,
    g,
    new Int32Array(g.left).fill(-1),
    {
      zh: `随机化二分图匹配（${mode === 'greedy' ? '贪心 1/2 近似' : '增广路径'}）。左 ${g.left} 点，右 ${g.right} 点，种子 ${seed}`,
      en: `Randomized bipartite matching (${mode === 'greedy' ? 'greedy 1/2-approx' : 'augmenting path'}). Left ${g.left}, Right ${g.right}, seed ${seed}`,
    },
    [
      { label: '模式', value: mode, role: 'frontier' as BarRole },
      { label: '种子', value: String(seed), role: 'default' as BarRole },
    ],
  );

  // 边集概览帧
  const edgeList = g.adj.map((row, u) => row.map((v) => `L${u}—R${v}`).join(', ')).join('; ');
  rec
    .begin({
      zh: `边集：${edgeList}`,
      en: `Edges: ${edgeList}`,
    })
    .setAux([{ label: '边集', value: edgeList, role: 'compare' as BarRole }])
    .commit();

  if (mode === 'greedy') {
    // 重放贪心逐步展示中间状态
    replayGreedyForTrace(
      rec,
      g,
      new Int32Array(g.left).fill(-1),
      new Int32Array(g.right).fill(-1),
      seed,
    );
  } else {
    // 分轮展示增广
    const matchL = new Int32Array(g.left).fill(-1);
    const matchR = new Int32Array(g.right).fill(-1);
    const rng = makeRng(seed);
    for (let r = 0; r < rounds; r++) {
      oneRoundAugment(g, matchL, matchR, rng);
      let matched = 0;
      for (let u = 0; u < g.left; u++) if (matchL[u]! !== -1) matched++;
      renderMatching(
        rec,
        g,
        matchL,
        {
          zh: `第 ${r + 1} 轮增广完成，匹配数 = ${matched}`,
          en: `Round ${r + 1} augment done, matching size = ${matched}`,
        },
        [{ label: '轮次', value: String(r + 1), role: 'frontier' as BarRole }],
      );
    }
  }

  // 终帧
  const finalMatch =
    mode === 'greedy'
      ? greedyMatching(g, makeRng(seed))
      : augmentMatching(g, makeRng(seed), rounds);
  renderMatching(
    rec,
    g,
    finalMatch.matchL,
    {
      zh: `完成：匹配大小 = ${finalMatch.size}`,
      en: `Done: matching size = ${finalMatch.size}`,
    },
    [
      { label: '最终匹配', value: String(finalMatch.size), role: 'final' as BarRole },
      {
        label: '边',
        value: finalMatch.edges.map((e) => `L${e.u}-R${e.v}`).join(', '),
        role: 'default' as BarRole,
      },
    ],
  );

  return rec.build();
}

export { greedyMatching, augmentMatching, makeSampleGraph };
