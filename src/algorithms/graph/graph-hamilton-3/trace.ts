// =============================================================================
// 哈密顿回路 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hamiltonCycle, type BipGraphInput, type HamiltonHooks } from './impl.ts';

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
  let path: string[] = [];

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
        input.edges.map((e) => ({ from: e.from, to: e.to, role: 'default' as BarRole })),
      )
      .setAux([{ label: 'Path', value: path.join('→') || '∅', role: 'frontier' }])
      .commit();
  };

  render({ zh: '哈密顿回溯开始', en: 'Hamilton backtracking' });

  const hooks: HamiltonHooks = {
    onExtend: (p) => {
      path = p;
      render({ zh: `扩展路径：${p.join('→')}`, en: `Extend: ${p.join('->')}` });
    },
    onBacktrack: (p) => {
      path = p;
      render({ zh: `回溯到：${p.join('→')}`, en: `Backtrack to: ${p.join('->')}` });
    },
  };

  const r = hamiltonCycle(input, hooks);

  rec
    .begin({
      zh: r ? `哈密顿回路：${r.join('→')}` : '不存在哈密顿回路',
      en: r ? `Cycle: ${r.join('->')}` : 'No cycle',
    })
    .setAux([{ label: '回路', value: r ? r.join(' ') : '无', role: 'final' }])
    .commit();

  return rec.build();
}
