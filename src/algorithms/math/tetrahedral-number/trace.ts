// =============================================================================
// 四面体数 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tetrahedralSequence, isTetrahedral, type TetrahedralHooks } from './impl.ts';

export const DEFAULT_INPUT = 8;

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input;
  const seq: number[] = [];
  let cur = -1;
  let lastCheck: { x: number; ok: boolean; rank: number | null } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    const labels: Record<number, string> = {};
    for (let i = 0; i < seq.length; i++) {
      labels[i] = `Te(${i + 1})\n${seq[i]}`;
      roles[i] = i === cur ? 'compare' : 'frontier';
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(seq, roles, labels))
      .setAux([
        { label: '公式', value: 'Te(n)=n(n+1)(n+2)/6', role: 'pivot' },
        { label: '个数', value: String(seq.length), role: 'frontier' },
        { label: '末项', value: seq.length ? String(seq[seq.length - 1]) : '—', role: 'final' },
        ...(lastCheck
          ? [
              {
                label: `判定 ${lastCheck.x}`,
                value: lastCheck.ok ? `是 Te(${lastCheck.rank})` : '非四面体数',
                role: (lastCheck.ok ? 'final' : 'warn') as BarRole,
              },
            ]
          : []),
      ])
      .commit();
  };

  render({ zh: `前 ${n} 个四面体数`, en: `First ${n} tetrahedral numbers` });

  const hooks: TetrahedralHooks = {
    onTerm: (i, t) => {
      seq.push(t);
      cur = i - 1;
      render({ zh: `Te(${i}) = ${t}`, en: `Te(${i}) = ${t}` });
    },
  };

  tetrahedralSequence(n, hooks);

  // 判定末项
  const last = seq[seq.length - 1] ?? 0;
  isTetrahedral(last, {
    onResult: (ok, rank) => {
      lastCheck = { x: last, ok, rank };
      cur = seq.length - 1;
      render({
        zh: `${last} ${ok ? `是第 ${rank} 个四面体数` : '非四面体数'}`,
        en: `${last} ${ok ? `is Te(${rank})` : 'not tetrahedral'}`,
      });
    },
  });

  cur = -1;
  rec
    .begin({ zh: `前 ${n} 个四面体数生成完毕`, en: `First ${n} tetrahedral numbers done` })
    .setBars(seq.map((v) => ({ value: v, role: 'final' as BarRole, label: String(v) })))
    .setAux([{ label: '末项', value: String(seq[seq.length - 1] ?? 0), role: 'final' }])
    .commit();

  return rec.build();
}
