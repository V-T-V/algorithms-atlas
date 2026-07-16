// =============================================================================
// 欧拉回路 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eulerCircuit, type BipGraphInput, type EulerHooks } from './impl.ts';

export const DEFAULT_INPUT: BipGraphInput = {
  nodes: ['A', 'B', 'C', 'D'],
  edges: [
    { from: 'A', to: 'B' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
    { from: 'D', to: 'A' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'D' },
  ],
};

const POS: Record<string, { x: number; y: number }> = {
  A: { x: 0.2, y: 0.3 },
  B: { x: 0.8, y: 0.3 },
  C: { x: 0.8, y: 0.7 },
  D: { x: 0.2, y: 0.7 },
};

export function buildTrace(input: BipGraphInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const path: string[] = [];
  let cur: { from: string; to: string } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setGraph(
        input.nodes.map((id) => ({
          id,
          label: id,
          x: POS[id]?.x ?? 0.5,
          y: POS[id]?.y ?? 0.5,
          role: (path.includes(id) ? 'final' : 'default') as BarRole,
        })),
        input.edges.map((e) => ({
          from: e.from,
          to: e.to,
          role: (cur && cur.from === e.from && cur.to === e.to ? 'compare' : 'default') as BarRole,
        })),
      )
      .setAux([{ label: 'Path', value: path.join('→') || '∅', role: 'frontier' }])
      .commit();
  };

  render({ zh: 'Hierholzer 开始', en: 'Hierholzer start' });

  const hooks: EulerHooks = {
    onWalk: (u, v) => {
      cur = { from: u, to: v };
      render({ zh: `走 ${u}→${v}`, en: `Walk ${u}->${v}` });
      cur = null;
    },
  };

  const r = eulerCircuit(input, hooks);
  if (r) path.push(...r);

  rec
    .begin({
      zh: r ? `欧拉回路：${r.join('→')}` : '不存在欧拉回路',
      en: r ? `Euler: ${r.join('->')}` : 'No Euler circuit',
    })
    .setAux([{ label: '回路', value: r ? r.join(' ') : '无', role: 'final' }])
    .commit();

  return rec.build();
}
