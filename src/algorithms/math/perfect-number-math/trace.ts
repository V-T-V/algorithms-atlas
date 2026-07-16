// =============================================================================
// 完全数·数学视角 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isPerfect, type PerfectHooks } from './impl.ts';

export const DEFAULT_INPUT = 28; // 28 = 1+2+4+7+14

export function buildTrace(input: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const divisors: number[] = [];
  let sum = 0;
  let result = false;

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(divisors.map((d) => ({ value: d, role: 'frontier' as BarRole, label: String(d) })))
      .setAux([
        { label: 'n', value: String(input), role: 'pivot' },
        { label: '已发现因子', value: divisors.join(', ') || '∅', role: 'frontier' },
        { label: '因子和', value: sum ? String(sum) : '（累加中）', role: 'compare' },
        { label: '判定', value: result ? '完全数' : '（判定中）', role: result ? 'final' : 'warn' },
      ])
      .commit();
  };

  render({ zh: `判定 n = ${input}`, en: `Test n = ${input}` });

  const hooks: PerfectHooks = {
    onDivisor: (d) => {
      divisors.push(d);
      render({ zh: `真因子 ${d}`, en: `Proper divisor ${d}` });
    },
    onSum: (s) => {
      sum = s;
      render({ zh: `因子和 = ${s}`, en: `Sum of divisors = ${s}` });
    },
    onResult: (ok) => {
      result = ok;
      render({
        zh: ok ? `${input} 是完全数` : `${input} 非完全数`,
        en: ok ? `${input} is perfect` : `${input} is not perfect`,
      });
    },
  };

  isPerfect(input, hooks);

  rec
    .begin({ zh: result ? '完全数' : '非完全数', en: result ? 'Perfect' : 'Not perfect' })
    .setBars(
      divisors.map((d) => ({
        value: d,
        role: (result ? 'final' : 'frontier') as BarRole,
        label: String(d),
      })),
    )
    .setAux([
      { label: '因子和', value: String(sum), role: 'compare' },
      { label: 'n', value: String(input), role: 'pivot' },
      { label: '结论', value: result ? '完全数' : '非完全数', role: result ? 'final' : 'warn' },
    ])
    .commit();

  return rec.build();
}
