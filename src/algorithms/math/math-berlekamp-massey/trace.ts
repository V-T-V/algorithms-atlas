import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { berlekampMassey, type BerlekampMasseyHooks } from './impl.ts';

export const DEFAULT_SEQ = [1, 1, 2, 3, 5, 8, 13, 21, 34]; // 斐波那契 mod 1e9+7

export function buildTrace(seq: number[] = DEFAULT_SEQ): Frame[] {
  const rec = new TraceRecorder();
  const lengths: number[] = [];

  rec
    .begin({ zh: `序列长 ${seq.length}`, en: `Sequence length ${seq.length}` })
    .setAux([{ label: '输入', value: `[${seq.join(',')}]`, role: 'frontier' }])
    .commit();

  const hooks: BerlekampMasseyHooks = {
    onUpdate: (i, d, len) => {
      lengths.push(len);
      rec
        .begin({ zh: `i=${i}, Δ=${d}, 新阶数=${len}`, en: `i=${i}, Δ=${d}, new order=${len}` })
        .setBars(
          lengths.map((v, idx) => ({
            value: v,
            role: (idx === lengths.length - 1 ? 'compare' : 'sorted') as BarRole,
          })),
        )
        .setAux([
          { label: 'i', value: String(i), role: 'frontier' },
          { label: '阶数', value: String(len), role: 'final' },
        ])
        .commit();
    },
  };

  const rec_coefs = berlekampMassey(seq, hooks);

  rec
    .begin({ zh: `递推 [${rec_coefs.join(',')}]`, en: `Recurrence [${rec_coefs.join(',')}]` })
    .setAux([{ label: '系数', value: `[${rec_coefs.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
