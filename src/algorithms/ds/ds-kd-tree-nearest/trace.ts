// =============================================================================
// K-D 树最近邻 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildKdTree, nearestNeighbor, type Point, type KdHooks } from './impl.ts';

export const DEFAULT_INPUT: { points: Point[]; target: Point } = {
  points: [
    { x: 2, y: 3 },
    { x: 5, y: 4 },
    { x: 9, y: 6 },
    { x: 4, y: 7 },
    { x: 8, y: 1 },
    { x: 7, y: 2 },
  ],
  target: { x: 6, y: 3 },
};

export function buildTrace(input: { points: Point[]; target: Point } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { points, target } = input;

  rec
    .begin({
      zh: `K-D 树：${points.length} 点，目标 (${target.x},${target.y})`,
      en: `K-D tree: ${points.length} pts, target (${target.x},${target.y})`,
    })
    .setAux([{ label: '目标', value: `(${target.x},${target.y})`, role: 'frontier' }])
    .commit();

  const hooks: KdHooks = {
    onBuild: (depth, axis, p) => {
      rec
        .begin({
          zh: `建树 depth=${depth} axis=${axis === 0 ? 'x' : 'y'} ← (${p.x},${p.y})`,
          en: `Build depth=${depth} axis=${axis === 0 ? 'x' : 'y'} ← (${p.x},${p.y})`,
        })
        .setAux([{ label: '节点', value: `(${p.x},${p.y})`, role: 'sorted' }])
        .commit();
    },
    onVisit: (depth, p) => {
      rec
        .begin({
          zh: `访问 depth=${depth} 的 (${p.x},${p.y})`,
          en: `Visit (${p.x},${p.y}) at depth=${depth}`,
        })
        .setAux([{ label: '访问', value: `(${p.x},${p.y})`, role: 'compare' }])
        .commit();
    },
    onCandidate: (p, d2) => {
      rec
        .begin({
          zh: `新候选 (${p.x},${p.y}) dist²=${d2.toFixed(2)}`,
          en: `Candidate (${p.x},${p.y}) dist²=${d2.toFixed(2)}`,
        })
        .setAux([{ label: '候选', value: d2.toFixed(2), role: 'final' }])
        .commit();
    },
    onPrune: (depth) => {
      rec
        .begin({ zh: `剪枝：depth=${depth} 另一侧`, en: `Prune: depth=${depth} other side` })
        .setAux([{ label: '剪枝', value: String(depth), role: 'warn' }])
        .commit();
    },
  };

  const tree = buildKdTree(points, hooks);
  const result = nearestNeighbor(tree, target, hooks);
  rec
    .begin({
      zh: `最近邻 = (${result.point?.x},${result.point?.y})，距离²=${result.dist.toFixed(2)}`,
      en: `Nearest = (${result.point?.x},${result.point?.y}), dist²=${result.dist.toFixed(2)}`,
    })
    .setAux([{ label: '最近', value: `(${result.point?.x},${result.point?.y})`, role: 'final' }])
    .commit();

  return rec.build();
}
