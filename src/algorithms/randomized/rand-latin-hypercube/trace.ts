// 拉丁超立方采样 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { latinHypercube, isLatinHypercube } from './impl.ts';

export const DEFAULT_INPUT = { n: 8, k: 2 };

export function buildTrace(input: { n: number; k: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `LHS（${input.n} 样本, ${input.k} 维）`,
      en: `LHS (${input.n} samples, ${input.k} dims)`,
    })
    .setAux([{ label: 'n×k', value: `${input.n}×${input.k}`, role: 'pivot' }])
    .commit();

  const samples = latinHypercube(input.n, input.k, undefined, {
    onPermute: (d, perm) => {
      rec
        .begin({
          zh: `维度 ${d} 置换 [${perm.join(',')}]`,
          en: `dim ${d} perm [${perm.join(',')}]`,
        })
        .setBars(perm.map((v) => ({ value: v, role: 'frontier' as BarRole })))
        .commit();
    },
  });

  const valid = isLatinHypercube(samples, input.n, input.k);

  rec
    .begin({ zh: valid ? 'LHS 性质成立' : '非 LHS', en: valid ? 'LHS property holds' : 'Not LHS' })
    .setBars(
      samples.map((s) => ({
        value: Math.round(s[0]! * 100),
        role: (valid ? 'final' : 'warn') as BarRole,
      })),
    )
    .setAux([{ label: '有效', value: String(valid), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
