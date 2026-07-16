// =============================================================================
// 单调栈 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';

export const DEFAULT_INPUT = [2, 1, 5, 6, 2, 3];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  // 复刻 nextGreater 的执行过程用于可视化
  const n = input.length;
  const res = new Array(n).fill(-1);
  const stack: number[] = [];
  const stackSnapshot = (): number[] => stack.map((i) => input[i]!);

  rec
    .begin({ zh: '开始扫描', en: 'Start scan' })
    .setBars(input.map((x) => ({ value: x, role: 'default' })))
    .commit();

  for (let i = 0; i < n; i++) {
    const v = input[i]!;
    while (stack.length > 0 && input[stack[stack.length - 1]!]! < v) {
      const top = stack.pop()!;
      res[top] = i;
      rec
        .begin({
          zh: `a[${i}]=${v} 弹出 a[${top}]=${input[top]}`,
          en: `a[${i}]=${v} pops a[${top}]=${input[top]}`,
        })
        .setBars(
          input.map((x, idx) => ({
            value: x,
            role: idx === top ? 'swap' : idx === i ? 'pivot' : 'default',
          })),
        )
        .setAux([{ label: 'stack', value: `[${stackSnapshot().join(',')}]`, role: 'frontier' }])
        .commit();
    }
    stack.push(i);
    rec
      .begin({ zh: `push a[${i}]=${v}`, en: `push a[${i}]=${v}` })
      .setBars(input.map((x, idx) => ({ value: x, role: idx === i ? 'pivot' : 'default' })))
      .setAux([{ label: 'stack', value: `[${stackSnapshot().join(',')}]`, role: 'frontier' }])
      .commit();
  }

  rec
    .begin({ zh: `结果 NGE = [${res.join(',')}]`, en: `NGE = [${res.join(',')}]` })
    .setBars(input.map((x) => ({ value: x, role: 'final' })))
    .setAux([{ label: 'NGE', value: `[${res.join(',')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
