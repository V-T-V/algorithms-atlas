// 尾递归累加器模式 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { factorialTail } from './impl.ts';

export const DEFAULT_INPUT = { n: 6 };

export function buildTrace(input: { n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `尾递归求 ${input.n}!`, en: `Tail-recursive ${input.n}!` })
    .setAux([{ label: 'acc', value: '1', role: 'pivot' }])
    .commit();

  const steps: number[] = [];
  const hooks = {
    onRecurse: (k: number, acc: number) => {
      steps.push(acc);
      rec
        .begin({
          zh: `helper(${k - 1}, ${acc} * ${k - 1})`,
          en: `helper(${k - 1}, ${acc} * ${k - 1})`,
        })
        .setBars(
          steps.map((v, i) => ({
            value: v,
            role: (i === steps.length - 1 ? 'compare' : 'sorted') as BarRole,
          })),
        )
        .setAux([{ label: 'acc', value: String(acc), role: 'pivot' as BarRole }])
        .commit();
    },
  };

  const r = factorialTail(input.n, hooks);

  rec
    .begin({ zh: `${input.n}! = ${r}`, en: `${input.n}! = ${r}` })
    .setBars([{ value: r, role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
