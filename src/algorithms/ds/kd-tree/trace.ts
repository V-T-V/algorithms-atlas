// =============================================================================
// KD树 · 录制帧序列
// 用 setGraph 展示点集（归一化坐标）+ 分割线（用 frontier 边表示）。
// 查询时访问的点标 'compare'，当前最佳点标 'pivot'，最终最近邻标 'final'，
// 剪枝点标 'warn'。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { KDTree, type KDTreeHooks, type Point } from './impl.ts';

export const DEFAULT_INPUT = {
  points: [
    { x: 2, y: 3 },
    { x: 5, y: 4 },
    { x: 9, y: 6 },
    { x: 4, y: 7 },
    { x: 8, y: 1 },
    { x: 7, y: 2 },
    { x: 1, y: 8 },
    { x: 6, y: 5 },
  ] as Point[],
  targets: [{ x: 6.5, y: 3.5 }] as Point[],
};

/** 归一化点到 [0.1, 0.9]。 */
function normalizer(pts: readonly Point[]): (p: Point) => { x: number; y: number } {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const sx = maxX - minX || 1;
  const sy = maxY - minY || 1;
  const pad = 0.1;
  return (p) => ({
    x: pad + (1 - 2 * pad) * ((p.x - minX) / sx),
    y: pad + (1 - 2 * pad) * (1 - (p.y - minY) / sy),
  });
}

/** 记录建树时每个分割节点的轴与坐标，用于画分割线。 */
interface SplitInfo {
  idx: number;
  axis: 'x' | 'y';
  depth: number;
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: { points: readonly Point[]; targets?: readonly Point[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const pts = input.points;
  const norm = normalizer([...pts, ...(input.targets ?? [])]);
  const idOf = (i: number): string => `p${i}`;

  const splits: SplitInfo[] = [];
  let visited = new Set<number>();
  let bestIdx = -1;
  let pruned = new Set<number>();
  let target: Point | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = pts.map((p, i) => {
      const np = norm(p);
      let role: BarRole = 'default';
      if (i === bestIdx) role = 'pivot';
      else if (pruned.has(i)) role = 'warn';
      else if (visited.has(i)) role = 'compare';
      return { id: idOf(i), label: `${i}`, x: np.x, y: np.y, role };
    });
    // 目标点
    if (target) {
      const np = norm(target);
      nodes.push({ id: 'target', label: 'T', x: np.x, y: np.y, role: 'frontier' });
    }
    // 分割线：用 frontier 边近似（节点间的折线），这里把同深度同侧连成线
    const edges: GraphEdge[] = [];
    // 简化：不画精确分割线，仅用 visited/best 的边表达路径
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  render({ zh: `点集 ${pts.length} 个，开始建树`, en: `${pts.length} points, build tree` });

  const buildHooks: KDTreeHooks = {
    onSplit: (idx, axis, depth) => {
      splits.push({ idx, axis, depth });
      render({
        zh: `建树：点 ${idx} 作分割（${axis} 轴，深度 ${depth}）`,
        en: `Build: point ${idx} splits (${axis}-axis, depth ${depth})`,
      });
    },
  };

  const tree = new KDTree(pts, buildHooks);

  // 查询阶段
  for (const t of input.targets ?? []) {
    visited = new Set<number>();
    pruned = new Set<number>();
    bestIdx = -1;
    target = t;
    render({ zh: `查询最近邻：T(${t.x}, ${t.y})`, en: `Query nearest: T(${t.x}, ${t.y})` });

    const queryHooks: KDTreeHooks = {
      onVisit: (idx) => visited.add(idx),
      onUpdateBest: (idx) => {
        bestIdx = idx;
        render({ zh: `更新最佳：点 ${idx}`, en: `New best: point ${idx}` });
      },
      onPrune: (idx) => {
        pruned.add(idx);
        render({ zh: `剪枝远侧子树`, en: `Prune far subtree` });
      },
      onBacktrack: (idx) => {
        void idx;
        render({ zh: `回溯检查远侧`, en: `Backtrack to far side` });
      },
      onResult: (_t, nearestIdx, dist) => {
        bestIdx = nearestIdx;
        render({
          zh: `最近邻 = 点 ${nearestIdx}，距离 ${dist.toFixed(3)}`,
          en: `Nearest = point ${nearestIdx}, dist ${dist.toFixed(3)}`,
        });
      },
    };
    tree.nearest(t, queryHooks);
  }

  // 终态：高亮所有目标的最近邻
  const finalBest = new Set<number>();
  for (const t of input.targets ?? []) {
    const r = tree.nearest(t);
    if (r) finalBest.add(r.idx);
  }
  const nodes: GraphNode[] = pts.map((p, i) => {
    const np = norm(p);
    return {
      id: idOf(i),
      label: `${i}`,
      x: np.x,
      y: np.y,
      role: (finalBest.has(i) ? 'final' : 'default') as BarRole,
    };
  });
  if (target) {
    const np = norm(target);
    nodes.push({ id: 'target', label: 'T', x: np.x, y: np.y, role: 'final' });
  }
  rec
    .begin({ zh: `完成；分割节点 ${splits.length} 个`, en: `Done; ${splits.length} split nodes` })
    .setGraph(nodes, [])
    .commit();

  return rec.build();
}
