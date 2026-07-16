// 迭代 Ackermann · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ackermannIter, type AckIterHooks } from './impl.ts';

export const DEFAULT_INPUT = { m: 2, n: 3 };

export function buildTrace(input: { m: number; n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { m, n } = input;
  let stackSnap: number[] = [];
  let curN = n;
  let stepNo = 0;
  let lastRule = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(
        stackSnap.map((sv, i) => ({
          value: sv + 1, // 可视化用 +1 让 m=0 也有高度
          role: (i === stackSnap.length - 1 ? 'pivot' : 'frontier') as BarRole,
          label: `m=${sv}`,
        })),
      )
      .setAux([
        { label: '步', value: String(stepNo), role: 'compare' as BarRole },
        { label: '栈深', value: String(stackSnap.length), role: 'frontier' as BarRole },
        { label: '当前 n', value: String(curN), role: 'pivot' as BarRole },
        {
          label: '栈顶 m',
          value: stackSnap.length ? String(stackSnap[stackSnap.length - 1]) : '∅',
          role: 'swap' as BarRole,
        },
        ...(lastRule ? [{ label: '规则', value: String(lastRule), role: 'warn' as BarRole }] : []),
      ])
      .commit();
    lastRule = 0;
  };

  snapshot({ zh: `A(${m},${n}) 开始`, en: `A(${m},${n}) start` });

  // 通过自定义栈跟踪同步栈状态
  const mirrorStack: number[] = [m];
  curN = n;

  const hooks: AckIterHooks = {
    onStep: (sz, _tm, tn) => {
      stackSnap = [...mirrorStack];
      curN = tn;
      stepNo++;
      void sz;
      snapshot({
        zh: `步 ${stepNo}：栈深 ${sz}, 栈顶 m=${_tm}, n=${tn}`,
        en: `Step ${stepNo}: depth ${sz}, top m=${_tm}, n=${tn}`,
      });
    },
    onReduce: (rule) => {
      lastRule = rule;
      // 同步 mirrorStack：根据规则重演
      if (rule === 1) {
        mirrorStack.pop();
        curN = curN + 1;
      } else if (rule === 2) {
        mirrorStack[mirrorStack.length - 1] = (mirrorStack[mirrorStack.length - 1] ?? 0) - 1;
        curN = 1;
      } else {
        const top = mirrorStack[mirrorStack.length - 1] ?? 0;
        mirrorStack[mirrorStack.length - 1] = top - 1;
        mirrorStack.push(top);
        curN = curN - 1;
      }
    },
  };

  const result = ackermannIter(m, n, 10_000_000, hooks);

  rec
    .begin({ zh: `A(${m},${n}) = ${result}`, en: `A(${m},${n}) = ${result}` })
    .setBars([{ value: result, role: 'final' as BarRole, label: `A=${result}` }])
    .setAux([
      { label: '结果', value: String(result), role: 'final' as BarRole },
      { label: '总步数', value: String(stepNo), role: 'frontier' as BarRole },
    ])
    .commit();

  return rec.build();
}
