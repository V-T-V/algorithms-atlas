// =============================================================================
// 最大流 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxFlow, type FlowGraphInput, type MaxFlowHooks } from './impl.ts';

export const DEFAULT_INPUT: FlowGraphInput = {
  nodes: ['s', 'A', 'B', 'C', 'D', 't'],
  edges: [
    { from: 's', to: 'A', capacity: 10 },
    { from: 's', to: 'B', capacity: 10 },
    { from: 'A', to: 'C', capacity: 4 },
    { from: 'A', to: 'D', capacity: 2 },
    { from: 'B', to: 'C', capacity: 9 },
    { from: 'B', to: 'D', capacity: 6 },
    { from: 'C', to: 't', capacity: 10 },
    { from: 'D', to: 't', capacity: 10 },
  ],
  source: 's',
  sink: 't',
};

export function buildTrace(input: FlowGraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let total = 0;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(
        input.nodes.map((id) => ({
          id,
          label: id,
          x: 0.5,
          y: 0.5,
          role: id === input.source ? 'pivot' : id === input.sink ? 'final' : 'default',
        })),
        input.edges.map((e) => ({
          from: e.from,
          to: e.to,
          weight: e.capacity,
          directed: true,
          role: 'default',
        })),
      )
      .setAux([{ label: '累计流', value: String(total), role: 'frontier' }])
      .commit();
  };

  snap({ zh: `源=${input.source}, 汇=${input.sink}`, en: `s=${input.source}, t=${input.sink}` });

  const hooks: MaxFlowHooks = {
    onAugment: (path, b, tot) => {
      total = tot;
      snap({
        zh: `增广路径 ${path.join('→')} 瓶颈=${b} 总流=${tot}`,
        en: `Augment ${path.join('->')} b=${b} total=${tot}`,
      });
    },
  };

  const ans = maxFlow(input, hooks);

  rec
    .begin({ zh: `最大流=${ans}`, en: `Max flow=${ans}` })
    .setAux([{ label: '最大流', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
