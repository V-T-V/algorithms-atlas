// 递归打印 1 到 n · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { printNumbers, type PrintNumbersHooks } from './impl.ts';

export const DEFAULT_INPUT = 6;

export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const printed: number[] = [];
  let callDepth = 0;
  let maxDepth = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const bars = Array.from({ length: n }, (_, i) => {
      const v = i + 1;
      return {
        value: v,
        role: (printed.includes(v) ? 'final' : 'default') as BarRole,
        label: String(v),
      };
    });
    rec
      .begin(note)
      .setBars(bars)
      .setAux([
        {
          label: '已打印',
          value: printed.length ? `[${printed.join(',')}]` : '∅',
          role: 'final' as BarRole,
        },
        { label: '当前栈深', value: String(callDepth), role: 'compare' as BarRole },
        { label: '最大深度', value: String(maxDepth), role: 'frontier' as BarRole },
      ])
      .commit();
  };

  snapshot({ zh: `打印 1 到 ${n}`, en: `Print 1 to ${n}` });

  const hooks: PrintNumbersHooks = {
    onRecurse: (_v, depth) => {
      callDepth = depth + 1;
      maxDepth = Math.max(maxDepth, depth + 1);
      snapshot({
        zh: `进入 printNumbers(${_v})（深度 ${depth + 1}）`,
        en: `Enter printNumbers(${_v}) (depth ${depth + 1})`,
      });
    },
    onBase: () => {
      callDepth = 0;
      snapshot({ zh: `基线 n=0`, en: `Base n=0` });
    },
    onPrint: (v, _d) => {
      printed.push(v);
      callDepth = Math.max(0, callDepth - 1);
      snapshot({ zh: `打印 ${v}`, en: `Print ${v}` });
    },
  };

  const result = printNumbers(n, hooks);

  rec
    .begin({ zh: `完成：[${result.join(', ')}]`, en: `Done: [${result.join(', ')}]` })
    .setBars(result.map((v) => ({ value: v, role: 'final' as BarRole, label: String(v) })))
    .setAux([
      { label: '结果', value: `[${result.join(',')}]`, role: 'final' as BarRole },
      { label: '最大深度', value: String(maxDepth), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
