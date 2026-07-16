import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bucketShuffle, makeRng } from './impl.ts';

export const DEFAULT_N = 10;

export function buildTrace(opts: { n?: number; seed?: number } = {}): Frame[] {
  const n = opts.n ?? DEFAULT_N;
  const seed = opts.seed ?? 7;
  const rec = new TraceRecorder();
  const keys = new Array(n).fill(0);
  const pos = new Array(n).fill(-1);

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        Array.from({ length: n }, (_, i) => ({
          value: pos[i] === -1 ? Math.round(keys[i] * 100) : pos[i]!,
          role: (pos[i] !== -1 ? 'final' : 'default') as BarRole,
          label: `${i}:k${keys[i].toFixed(2)}`,
        })),
      )
      .setAux([
        { label: '键', value: keys.map((k) => k.toFixed(2)).join(' '), role: 'compare' as BarRole },
      ])
      .commit();
  };

  snap({ zh: `初始 ${n} 个元素`, en: `Init ${n} elements` });

  const result = bucketShuffle(n, makeRng(seed), {
    onKey: (i, k) => {
      keys[i] = k;
      snap({ zh: `元素 ${i} 键=${k.toFixed(3)}`, en: `Element ${i} key=${k.toFixed(3)}` });
    },
    onPlace: (i, p) => {
      pos[i] = p;
    },
  });

  rec
    .begin({ zh: `完成：${result.join(',')}`, en: `Done: ${result.join(',')}` })
    .setBars(result.map((v, i) => ({ value: v, role: 'final' as BarRole, label: `${i}→${v}` })))
    .setAux([{ label: '结果', value: result.join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
