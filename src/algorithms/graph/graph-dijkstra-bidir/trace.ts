// =============================================================================
// 双向 Dijkstra · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bidirectionalDijkstra, type BiDijkstraHooks, type WeightedGraphInput } from './impl.ts';

export const DEFAULT_INPUT: WeightedGraphInput = {
  nodes: ['S', 'A', 'B', 'C', 'D', 'T'],
  edges: [
    { from: 'S', to: 'A', weight: 4 },
    { from: 'S', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 5 },
    { from: 'B', to: 'C', weight: 8 },
    { from: 'B', to: 'D', weight: 10 },
    { from: 'C', to: 'D', weight: 2 },
    { from: 'C', to: 'T', weight: 6 },
    { from: 'D', to: 'T', weight: 3 },
  ],
};
export const DEFAULT_SOURCE = 'S';
export const DEFAULT_TARGET = 'T';

export function buildTrace(
  input: WeightedGraphInput = DEFAULT_INPUT,
  source = DEFAULT_SOURCE,
  target = DEFAULT_TARGET,
): Frame[] {
  const rec = new TraceRecorder();
  const settledF = new Set<string>();
  const settledB = new Set<string>();
  let mu = Infinity;

  const hooks: BiDijkstraHooks = {
    onSettle: (side, node, dist) => {
      if (side === 'fwd') settledF.add(node);
      else settledB.add(node);
      rec
        .begin({
          zh: `${side === 'fwd' ? '前向' : '反向'}定居 ${node}: d=${dist}`,
          en: `${side} settle ${node}: d=${dist}`,
        })
        .setAux([
          { label: '前向已定居', value: [...settledF].join(',') || '-', role: 'frontier' },
          { label: '反向已定居', value: [...settledB].join(',') || '-', role: 'pivot' },
        ])
        .commit();
    },
    onMeet: (d) => {
      mu = d;
      rec
        .begin({ zh: `相遇 mu=${d}`, en: `Meet mu=${d}` })
        .setAux([{ label: '当前最优', value: String(d), role: 'swap' }])
        .commit();
    },
    onDone: (found, dist) => {
      rec
        .begin({
          zh: found ? `最短=${dist}` : '不可达',
          en: found ? `shortest=${dist}` : 'unreachable',
        })
        .setAux([{ label: '最短距离', value: found ? String(dist) : '∞', role: 'final' }])
        .commit();
    },
  };

  bidirectionalDijkstra(input, source, target, hooks);
  return rec.build();
}
