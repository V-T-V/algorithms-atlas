// =============================================================================
// Mean-Shift 均值漂移聚类 · 录制帧序列
// 用 setGraph 展示：数据点漂移轨迹，mode 用 frontier/final 标记。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { meanShift, type MeanShiftHooks, type Point } from './impl.ts';

export interface MeanShiftInput {
  points: Point[];
  bandwidth: number;
}

export const DEFAULT_INPUT: MeanShiftInput = {
  points: [
    { x: 1, y: 1 },
    { x: 1.5, y: 1.2 },
    { x: 0.8, y: 1.6 },
    { x: 8, y: 8 },
    { x: 8.5, y: 7.8 },
    { x: 7.7, y: 8.3 },
    { x: 4, y: 5 },
    { x: 4.5, y: 5.2 },
    { x: 3.8, y: 4.7 },
  ],
  bandwidth: 2,
};

const MODE_ROLES: BarRole[] = ['pivot', 'swap', 'warn', 'frontier'];

/** 把所有点映射到 [0,1]×[0,1] 归一化坐标。 */
function normalize(all: Point[], padding = 0.08): (p: Point) => { x: number; y: number } {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const p of all) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  return (p: Point) => ({
    x: padding + ((p.x - minX) / spanX) * (1 - 2 * padding),
    y: 1 - (padding + ((p.y - minY) / spanY) * (1 - 2 * padding)),
  });
}

/** 录制演示帧序列。 */
export function buildTrace(input: MeanShiftInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { points, bandwidth } = input;
  const allCoords = [...points];
  const norm = normalize(allCoords);

  let curPoints = points.map((p) => ({ ...p }));
  let activePoint = -1;

  const render = (
    note: { zh: string; en: string },
    options: { modes?: Point[]; assignments?: number[]; modeRole?: BarRole } = {},
  ): void => {
    const nodes: GraphNode[] = curPoints.map((p, i) => {
      const np = norm(p);
      const cluster = options.assignments ? options.assignments[i]! : 0;
      return {
        id: `p${i}`,
        label: `P${i}`,
        x: np.x,
        y: np.y,
        role:
          i === activePoint ? 'compare' : (MODE_ROLES[cluster % MODE_ROLES.length] ?? 'default'),
      };
    });
    const edges: GraphEdge[] = [];
    if (options.modes && options.assignments) {
      options.modes.forEach((m, mi) => {
        const nm = norm(m);
        nodes.push({
          id: `mode${mi}`,
          label: `M${mi}`,
          x: nm.x,
          y: nm.y,
          role: options.modeRole ?? 'final',
        });
      });
      curPoints.forEach((_, i) => {
        edges.push({ from: `p${i}`, to: `mode${options.assignments![i]!}`, role: 'default' });
      });
    }
    rec.begin(note).setGraph(nodes, edges).commit();
  };

  render({
    zh: `初始 ${points.length} 个点，带宽 ${bandwidth}`,
    en: `${points.length} points, bandwidth ${bandwidth}`,
  });

  const hooks: MeanShiftHooks = {
    onIteration: (iter, pts) => {
      curPoints = pts.map((p) => ({ ...p }));
      render({
        zh: `第 ${iter + 1} 轮漂移`,
        en: `Shift round ${iter + 1}`,
      });
    },
    onShift: (i, _from, _to) => {
      activePoint = i;
    },
  };

  const result = meanShift(points, { bandwidth, maxIterations: 30 }, hooks);
  activePoint = -1;
  curPoints = result.shifted.map((p) => ({ ...p }));

  render(
    {
      zh: `收敛：${result.modes.length} 个簇，${result.iterations} 轮`,
      en: `Converged: ${result.modes.length} clusters in ${result.iterations} rounds`,
    },
    { modes: result.modes, assignments: result.assignments, modeRole: 'final' },
  );

  return rec.build();
}
