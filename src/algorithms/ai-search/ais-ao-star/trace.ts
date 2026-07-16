import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { aoStarSearch, type AoProblem, type AoNode } from './impl.ts';
const nodes = new Map<number, AoNode>([
  [0, { id: 0, isGoal: false, connectors: [{ children: [1, 2], cost: 1 }] }],
  [
    1,
    {
      id: 1,
      isGoal: false,
      connectors: [
        { children: [3], cost: 1 },
        { children: [4], cost: 1 },
      ],
    },
  ],
  [2, { id: 2, isGoal: true, connectors: [] }],
  [3, { id: 3, isGoal: true, connectors: [] }],
  [4, { id: 4, isGoal: true, connectors: [] }],
]);
const P: AoProblem = { nodes, root: 0, h: (n) => [3, 2, 0, 0, 0][n] ?? 0 };
export const DEFAULT_INPUT = P;
export function buildTrace(input: AoProblem = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'AO* 与或图', en: 'AO*' }).commit();
  const { cost } = aoStarSearch(input, {
    onExpand: (n) =>
      rec
        .begin({ zh: '标记 ' + n, en: 'mark ' + n })
        .setAux([{ label: 'node', value: String(n), role: 'compare' as BarRole }])
        .commit(),
    onCost: (n, c) =>
      rec
        .begin({ zh: '节点' + n + ' 代价' + c, en: 'cost ' + n })
        .setAux([
          { label: 'node', value: String(n), role: 'pivot' as BarRole },
          { label: 'cost', value: String(c), role: 'default' as BarRole },
        ])
        .commit(),
  });
  rec
    .begin({ zh: '根代价 ' + cost, en: 'root cost ' + cost })
    .setAux([{ label: 'cost', value: String(cost), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
