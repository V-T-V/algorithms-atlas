// =============================================================================
// Kosaraju SCC · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { kosarajuSCC, type KosarajuHooks, type TarjanGraphInput } from './impl.ts';

export const DEFAULT_INPUT: TarjanGraphInput = {
  nodes: ['1', '2', '3', '4', '5'],
  edges: [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '1' },
    { from: '3', to: '4' },
    { from: '4', to: '5' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  '1': { x: 0.2, y: 0.3 },
  '2': { x: 0.45, y: 0.15 },
  '3': { x: 0.45, y: 0.6 },
  '4': { x: 0.7, y: 0.6 },
  '5': { x: 0.9, y: 0.3 },
};

export function buildTrace(input: TarjanGraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const sccColor = new Map<string, number>();
  let colorIdx = 0;

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
      .commit();
  };

  render({ zh: 'Kosaraju 开始', en: 'Kosaraju start' });

  const hooks: KosarajuHooks = {
    onOrder: (o) => {
      render({ zh: `第一遍 DFS 完成序：${o.join('→')}`, en: `Finish order: ${o.join('->')}` });
    },
    onSCC: (members) => {
      colorIdx++;
      for (const m of members) sccColor.set(m, colorIdx);
      render({
        zh: `SCC #${colorIdx}: {${members.join(',')}}`,
        en: `SCC #${colorIdx}: {${members.join(',')}}`,
      });
    },
  };

  const sccs = kosarajuSCC(input, hooks);

  rec
    .begin({ zh: `共 ${sccs.length} 个 SCC`, en: `${sccs.length} SCCs` })
    .setAux([{ label: 'SCC 数', value: String(sccs.length), role: 'final' }])
    .commit();

  return rec.build();
}
