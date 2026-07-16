// =============================================================================
// 图着色 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyColor, type BipGraphInput, type ColorHooks } from './impl.ts';

export const DEFAULT_INPUT: BipGraphInput = {
  nodes: ['1', '2', '3', '4', '5'],
  edges: [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '2', to: '3' },
    { from: '2', to: '4' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '1': { x: 0.2, y: 0.3 },
  '2': { x: 0.4, y: 0.7 },
  '3': { x: 0.5, y: 0.3 },
  '4': { x: 0.7, y: 0.7 },
  '5': { x: 0.9, y: 0.3 },
};

export function buildTrace(input: BipGraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const coloring = new Map<string, number>();

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(
        input.nodes.map((id) => ({
          id,
          label: `${id}:C${coloring.get(id) ?? '-'}`,
          x: POS[id]?.x ?? 0.5,
          y: POS[id]?.y ?? 0.5,
          role: (coloring.has(id) ? 'final' : 'default') as BarRole,
        })),
        input.edges.map((e) => ({ from: e.from, to: e.to, role: 'default' as BarRole })),
      )
      .commit();
  };

  render({ zh: '贪心着色开始', en: 'Greedy coloring' });

  const hooks: ColorHooks = {
    onColor: (u, c) => {
      coloring.set(u, c);
      render({ zh: `${u} 染色 C${c}`, en: `${u} color ${c}` });
    },
  };

  const r = greedyColor(input, hooks);

  rec
    .begin({ zh: `共使用 ${r.maxColor} 种颜色`, en: `Used ${r.maxColor} colors` })
    .setAux([{ label: '色数', value: String(r.maxColor), role: 'final' }])
    .commit();

  return rec.build();
}
