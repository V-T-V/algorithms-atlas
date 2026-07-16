// =============================================================================
// 盈数判定 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { classifyNumber, type AbundantHooks } from './impl.ts';

export const DEFAULT_INPUT = 12; // 1+2+3+4+6 = 16 > 12

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const divisors: number[] = [];
  let sum = 0;
  let kind: 'abundant' | 'perfect' | 'deficient' | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const zhKind =
      kind === 'abundant'
        ? '盈数'
        : kind === 'perfect'
          ? '完全数'
          : kind === 'deficient'
            ? '亏数'
            : '（判定中）';
    rec
      .begin(note)
      .setBars(divisors.map((d) => ({ value: d, role: 'frontier' as BarRole, label: String(d) })))
      .setAux([
        { label: 'n', value: String(input), role: 'pivot' },
        { label: '因子', value: divisors.join(', ') || '∅', role: 'frontier' },
        { label: '因子和', value: sum ? String(sum) : '（累加）', role: 'compare' },
        { label: '判定', value: zhKind, role: kind === 'abundant' ? 'final' : 'warn' },
      ])
      .commit();
  };

  render({ zh: `判定 n = ${input}`, en: `Test n = ${input}` });

  const hooks: AbundantHooks = {
    onDivisor: (d) => {
      divisors.push(d);
      render({ zh: `因子 ${d}`, en: `Divisor ${d}` });
    },
    onSum: (s) => {
      sum = s;
      render({ zh: `因子和 = ${s}`, en: `Sum = ${s}` });
    },
    onResult: (k) => {
      kind = k;
      render({ zh: `归类：${k}`, en: `Classified: ${k}` });
    },
  };

  classifyNumber(input, hooks);

  rec
    .begin({
      zh: kind === 'abundant' ? '盈数' : kind === 'perfect' ? '完全数' : '亏数',
      en: kind ?? 'deficient',
    })
    .setBars(
      divisors.map((d) => ({
        value: d,
        role: (kind === 'abundant' ? 'final' : 'frontier') as BarRole,
        label: String(d),
      })),
    )
    .setAux([
      { label: '结论', value: kind ?? 'deficient', role: kind === 'abundant' ? 'final' : 'warn' },
    ])
    .commit();

  return rec.build();
}
