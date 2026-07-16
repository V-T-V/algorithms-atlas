// =============================================================================
// Tarjan SCC · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tarjanSCC, type TarjanGraphInput, type TarjanHooks } from './impl.ts';

export const DEFAULT_INPUT: TarjanGraphInput = {
  nodes: ['1', '2', '3', '4', '5', '6', '7'],
  edges: [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '1' },
    { from: '2', to: '4' },
    { from: '4', to: '5' },
    { from: '5', to: '6' },
    { from: '6', to: '4' },
    { from: '7', to: '3' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '1': { x: 0.2, y: 0.5 },
  '2': { x: 0.35, y: 0.5 },
  '3': { x: 0.5, y: 0.2 },
  '4': { x: 0.55, y: 0.7 },
  '5': { x: 0.75, y: 0.7 },
  '6': { x: 0.75, y: 0.4 },
  '7': { x: 0.2, y: 0.85 },
};

export function buildTrace(input: TarjanGraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const sccColor = new Map<string, number>();
  let colorIdx = 0;
  const stack: string[] = [];

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(
        input.nodes.map((id) => ({
          id,
          label: id,
          x: POS[id]?.x ?? 0.5,
          y: POS[id]?.y ?? 0.5,
          role: (sccColor.has(id) ? 'final' : 'default') as BarRole,
        })),
        input.edges.map((e) => ({
          from: e.from,
          to: e.to,
          directed: true,
          role: 'default' as BarRole,
        })),
      )
      .setAux([{ label: 'Stack', value: stack.length ? stack.join(',') : '∅', role: 'frontier' }])
      .commit();
  };

  render({ zh: 'Tarjan SCC 开始', en: 'Tarjan SCC start' });

  const hooks: TarjanHooks = {
    onDiscover: (u) => {
      stack.push(u);
      render({ zh: `发现 ${u}`, en: `Discover ${u}` });
    },
    onSCC: (members) => {
      colorIdx++;
      for (const m of members) sccColor.set(m, colorIdx);
      for (const m of members) {
        const idx = stack.indexOf(m);
        if (idx >= 0) stack.splice(idx, 1);
      }
      render({
        zh: `SCC #${colorIdx}: {${members.join(',')}}`,
        en: `SCC #${colorIdx}: {${members.join(',')}}`,
      });
    },
  };

  const sccs = tarjanSCC(input, hooks);

  rec
    .begin({ zh: `共 ${sccs.length} 个 SCC`, en: `${sccs.length} SCCs total` })
    .setAux([{ label: 'SCC 数', value: String(sccs.length), role: 'final' }])
    .commit();

  return rec.build();
}
