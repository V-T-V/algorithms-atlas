// 最优除法 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btOptimalDivision, type BtOptimalDivisionHooks } from './impl.ts';

export const DEFAULT_INPUT = [1000, 100, 10, 2];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `对 [${input.join(', ')}] 加括号使连除最大`,
      en: `Parenthesize [${input.join(', ')}] to maximize the division`,
    })
    .setBars(input.map((v) => ({ value: v, role: 'default' as BarRole })))
    .commit();

  const hooks: BtOptimalDivisionHooks = {
    onResult: (expr) => {
      const val = input[0]! / input.slice(1).reduce((a, v) => a / v);
      rec
        .begin({ zh: `结果：${expr}`, en: `Result: ${expr}` })
        .setAux([
          { label: 'expr', value: expr, role: 'final' },
          { label: 'value', value: String(val), role: 'final' },
        ])
        .commit();
    },
  };

  const expr = btOptimalDivision(input, hooks);

  rec
    .begin({ zh: `完成：${expr}`, en: `Done: ${expr}` })
    .setBars([{ value: input.length, role: 'final' as BarRole }])
    .setAux([{ label: '表达式', value: expr, role: 'final' }])
    .commit();

  return rec.build();
}
