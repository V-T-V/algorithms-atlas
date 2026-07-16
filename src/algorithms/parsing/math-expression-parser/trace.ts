// 数学表达式解析 · 录制帧序列
// 用 setAux 展示递归下降的进入/函数调用/结果。

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { evalMath, type MathParserHooks } from './impl.ts';

export const DEFAULT_INPUT = 'max(sin(0), 2^3) + sqrt(16)';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const stack: string[] = [];
  const calls: Array<{ name: string; args: number[]; result: number }> = [];

  rec
    .begin({ zh: `解析表达式：${input}`, en: `Parse: ${input}` })
    .setAux([{ label: '表达式', value: input, role: 'pivot' }])
    .commit();

  const hooks: MathParserHooks = {
    onEnter: (nt) => {
      stack.push(nt);
      rec
        .begin({ zh: `进入非终结符 ${nt}`, en: `Enter ${nt}` })
        .setAux([
          { label: '解析栈', value: stack.join(' → ') || '∅', role: 'compare' },
          {
            label: '函数调用',
            value: calls.map((c) => `${c.name}(${c.args.join(',')})=${c.result}`).join('  ') || '∅',
            role: 'default',
          },
        ])
        .commit();
      stack.pop();
    },
    onCall: (name, args, result) => {
      calls.push({ name, args: [...args], result });
      rec
        .begin({
          zh: `调用 ${name}(${args.join(', ')}) = ${result}`,
          en: `Call ${name}(${args.join(', ')}) = ${result}`,
        })
        .setAux([
          {
            label: '函数调用',
            value: calls.map((c) => `${c.name}(${c.args.join(',')})=${c.result}`).join('  '),
            role: 'final',
          },
        ])
        .commit();
    },
  };

  const result = evalMath(input, {}, hooks);

  rec
    .begin({ zh: `结果 = ${result}`, en: `Result = ${result}` })
    .setAux([
      { label: '表达式', value: input, role: 'default' },
      { label: '结果', value: String(result), role: 'final' },
    ])
    .commit();

  return rec.build();
}
