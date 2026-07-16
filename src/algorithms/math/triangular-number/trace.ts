// =============================================================================
// 三角数 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { triangularSequence, isTriangular, type TriangularHooks } from './impl.ts';

export const DEFAULT_INPUT = 10; // 前 10 个三角数

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const seq: number[] = [];
  let cur = -1;
  let lastCheck: { x: number; isT: boolean; rank: number | null } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    const labels: Record<number, string> = {};
    for (let i = 0; i < seq.length; i++) {
      labels[i] = `T(${i + 1})\n${seq[i]}`;
      if (i === cur) roles[i] = 'compare';
      else roles[i] = 'frontier';
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(seq, roles, labels))
      .setAux([
        { label: '公式', value: 'T(n)=n(n+1)/2', role: 'pivot' },
        { label: '个数', value: String(seq.length), role: 'frontier' },
        { label: '末项', value: seq.length ? String(seq[seq.length - 1]) : '—', role: 'final' },
        ...(lastCheck
          ? [
              {
                label: `判定 ${lastCheck.x}`,
                value: lastCheck.isT ? `是 T(${lastCheck.rank})` : '非三角数',
                role: (lastCheck.isT ? 'final' : 'warn') as BarRole,
              },
            ]
          : []),
      ])
      .commit();
  };

  render({ zh: `前 ${n} 个三角数`, en: `First ${n} triangular numbers` });

  const hooks: TriangularHooks = {
    onTerm: (i, t) => {
      seq.push(t);
      cur = i - 1;
      render({ zh: `T(${i}) = ${t}`, en: `T(${i}) = ${t}` });
    },
  };

  triangularSequence(n, hooks);

  // 额外：判定最后一项是三角数
  const last = seq[seq.length - 1] ?? 0;
  isTriangular(last, {
    onResult: (ok, rank) => {
      lastCheck = { x: last, isT: ok, rank };
      cur = seq.length - 1;
      render({
        zh: `${last} ${ok ? `是第 ${rank} 个三角数` : '非三角数'}`,
        en: `${last} ${ok ? `is T(${rank})` : 'not triangular'}`,
      });
    },
  });

  cur = -1;
  rec
    .begin({ zh: `前 ${n} 个三角数生成完毕`, en: `First ${n} triangulars done` })
    .setBars(seq.map((v) => ({ value: v, role: 'final' as BarRole, label: String(v) })))
    .setAux([{ label: '末项', value: String(seq[seq.length - 1] ?? 0), role: 'final' }])
    .commit();

  return rec.build();
}
