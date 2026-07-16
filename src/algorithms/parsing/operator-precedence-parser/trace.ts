// 算符优先分析 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { operatorPrecedenceParse, type OppHooks, type OppStep } from './impl.ts';

export const DEFAULT_INPUT = '3 + 4 * 2 ^ 2';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const steps: OppStep[] = [];
  let lastReduce = '';

  const snapshot = (note: { zh: string; en: string }, cur?: OppStep): void => {
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '动作', value: cur?.action ?? '∅', role: 'pivot' as BarRole },
      { label: '栈', value: cur?.stack.join(' ') ?? '∅', role: 'frontier' as BarRole },
      { label: '剩余输入', value: cur?.input.join(' ') ?? '∅', role: 'compare' as BarRole },
    ];
    if (lastReduce) aux.push({ label: '归约', value: lastReduce, role: 'final' as BarRole });
    rec.begin(note).setAux(aux).commit();
    lastReduce = '';
  };

  snapshot({ zh: `解析 "${input}"`, en: `Parse "${input}"` });

  const hooks: OppHooks = {
    onStep: (s) => {
      steps.push(s);
      snapshot(
        {
          zh: `${s.action}：栈=[${s.stack.join(' ')}] 输入=[${s.input.join(' ')}]`,
          en: `${s.action}: stack=[${s.stack.join(' ')}] input=[${s.input.join(' ')}]`,
        },
        s,
      );
    },
    onReduce: (op, l, r, res) => {
      lastReduce = `${l} ${op} ${r} = ${res}`;
    },
  };

  const result = operatorPrecedenceParse(input, hooks);

  rec
    .begin({ zh: `结果 = ${result}`, en: `Result = ${result}` })
    .setAux([
      { label: '结果', value: String(result), role: 'final' as BarRole },
      { label: '总步数', value: String(steps.length), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
