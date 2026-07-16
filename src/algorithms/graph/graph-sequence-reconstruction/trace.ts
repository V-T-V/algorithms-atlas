// =============================================================================
// 序列重建 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sequenceReconstruction, type SequenceReconHooks } from './impl.ts';

export const DEFAULT_ORG = [4, 1, 5, 2, 6, 3];
export const DEFAULT_SEQS = [
  [5, 2, 6, 3],
  [4, 1, 5, 2],
];

export function buildTrace(org: number[] = DEFAULT_ORG, seqs: number[][] = DEFAULT_SEQS): Frame[] {
  const rec = new TraceRecorder();
  const order: number[] = [];
  let ok = false;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = org.map((x) => (order.includes(x) ? 'final' : 'default'));
    rec
      .begin(note)
      .setBars(org.map((x, i) => ({ value: x, role: roles[i]! })))
      .setAux([
        { label: 'org', value: org.join(' → '), role: 'pivot' },
        { label: '拓扑序', value: order.length ? order.join(' → ') : '∅', role: 'frontier' },
      ])
      .commit();
  };

  snap({ zh: `org=${org.join(',')}`, en: `org=${org.join(',')}` });

  const hooks: SequenceReconHooks = {
    onEdge: (a, b) => snap({ zh: `边 ${a}→${b}`, en: `Edge ${a}→${b}` }),
    onOutput: (u) => {
      order.push(u);
      snap({ zh: `输出 ${u}`, en: `Output ${u}` });
    },
    onResult: (r) => {
      ok = r;
      snap({
        zh: r ? '可唯一重建' : '不可重建',
        en: r ? 'Reconstructible' : 'Not reconstructible',
      });
    },
  };

  sequenceReconstruction(org, seqs, hooks);

  rec
    .begin({ zh: ok ? '完成：匹配' : '失败', en: ok ? 'Done: match' : 'Failed' })
    .setBars(org.map((x) => ({ value: x, role: 'final' as BarRole })))
    .setAux([{ label: '结果', value: ok ? 'true' : 'false', role: 'final' }])
    .commit();

  return rec.build();
}
