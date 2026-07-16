// =============================================================================
// 随机化哈密顿路径判定 · 录制帧序列
// 用 setGraph 展示图与当前尝试的路径（高亮断边），用 setAux 展示重启/步数。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  randomizedHamiltonianPath,
  makeAdjacency,
  makeRng,
  type Adjacency,
  type HamiltonianHooks,
} from './impl.ts';

export const DEFAULT_INPUT = {
  // 5 顶点路径图 0-1-2-3-4（含哈密顿路径）
  n: 5,
  edges: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [0, 2],
    [1, 3],
    [2, 4],
  ] as Array<[number, number]>,
  restarts: 30,
  seed: 42,
};

interface BuildTraceInput {
  n?: number;
  edges?: Array<[number, number]>;
  restarts?: number;
  seed?: number;
}

// 把顶点放在一个圆周上
function nodePos(i: number, n: number): { x: number; y: number } {
  const theta = (2 * Math.PI * i) / n - Math.PI / 2;
  return { x: 0.5 + 0.4 * Math.cos(theta), y: 0.5 + 0.4 * Math.sin(theta) };
}

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const n = input.n ?? DEFAULT_INPUT.n;
  const edges = input.edges ?? DEFAULT_INPUT.edges;
  const restarts = input.restarts ?? DEFAULT_INPUT.restarts;
  const seed = input.seed ?? DEFAULT_INPUT.seed;

  const adj: Adjacency = makeAdjacency(n, edges);
  const rec = new TraceRecorder();

  // 静态图节点/边
  const baseNodes: GraphNode[] = Array.from({ length: n }, (_, i) => {
    const p = nodePos(i, n);
    return { id: `v${i}`, label: String(i), x: p.x, y: p.y, role: 'default' as BarRole };
  });
  const baseEdges: GraphEdge[] = edges.map(([u, v]) => ({
    from: `v${u}`,
    to: `v${v}`,
    role: 'default' as BarRole,
  }));

  rec
    .begin({
      zh: `随机化哈密顿路径：${n} 顶点，${edges.length} 条边，${restarts} 次重启`,
      en: `Randomized Hamiltonian path: ${n} vertices, ${edges.length} edges, ${restarts} restarts`,
    })
    .setGraph(baseNodes, baseEdges)
    .setAux([
      { label: '顶点数', value: String(n), role: 'pivot' as BarRole },
      { label: '边数', value: String(edges.length), role: 'frontier' as BarRole },
      { label: '重启次数', value: String(restarts), role: 'default' as BarRole },
    ])
    .commit();

  let framesThisTrace = 0;
  const MAX_FRAMES = 12; // 限制帧数避免过长

  const hooks: HamiltonianHooks = {
    onRestart: (r, perm) => {
      if (framesThisTrace >= MAX_FRAMES) return;
      framesThisTrace++;
      rec
        .begin({
          zh: `重启 ${r + 1}：初始排列 [${perm.join(',')}]`,
          en: `Restart ${r + 1}: initial permutation [${perm.join(',')}]`,
        })
        .setGraph(baseNodes, baseEdges)
        .setAux([
          { label: '重启', value: String(r + 1), role: 'pivot' as BarRole },
          { label: '排列', value: perm.join(','), role: 'swap' as BarRole },
        ])
        .commit();
    },
    onCheck: (r, brokenCount) => {
      if (framesThisTrace >= MAX_FRAMES) return;
      if (brokenCount > 0 && r < 3) {
        framesThisTrace++;
        rec
          .begin({
            zh: `重启 ${r + 1}：当前断边数 ${brokenCount}`,
            en: `Restart ${r + 1}: ${brokenCount} broken edges`,
          })
          .setAux([
            { label: '重启', value: String(r + 1), role: 'pivot' as BarRole },
            {
              label: '断边数',
              value: String(brokenCount),
              role: (brokenCount === 0 ? 'final' : 'warn') as BarRole,
            },
          ])
          .commit();
      }
    },
    onResult: (path, restartsUsed) => {
      rec
        .begin({
          zh: path
            ? `完成：在第 ${restartsUsed} 次重启找到哈密顿路径 [${path.join('→')}]`
            : `完成：${restartsUsed} 次重启均未找到`,
          en: path
            ? `Done: found Hamiltonian path [${path.join('→')}] at restart ${restartsUsed}`
            : `Done: not found after ${restartsUsed} restarts`,
        })
        .setGraph(baseNodes, baseEdges)
        .setAux([
          {
            label: '结论',
            value: path ? '找到路径' : '未找到',
            role: (path ? 'final' : 'warn') as BarRole,
          },
          { label: '路径', value: path ? path.join(' → ') : '—', role: 'final' as BarRole },
          { label: '重启数', value: String(restartsUsed), role: 'default' as BarRole },
        ])
        .commit();
    },
  };

  randomizedHamiltonianPath(n, adj, restarts, n * n, makeRng(seed), hooks);

  return rec.build();
}
