// =============================================================================
// 单调栈 · 录制帧序列
// 用 setBars 展示数组，高亮当前下标与栈内元素；
// setAux 展示当前栈内容与 left/right 的部分结果。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { monotonicStack, type MonotonicStackHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 1, 5, 6, 2, 3];

interface TraceOptions {
  arr: number[];
}

/** 录制演示帧序列。 */
export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const arr = opts.arr ?? DEFAULT_INPUT;
  const rec = new TraceRecorder();
  const n = arr.length;

  let curIdx = -1;
  const stack: number[] = [];
  const left: number[] = new Array(n).fill(-1);
  const right: number[] = new Array(n).fill(n);

  const snapshot = (note: { zh: string; en: string }): void => {
    const stackSet = new Set(stack);
    const bars = arr.map((v, i) => {
      let role: BarRole = 'default';
      if (stackSet.has(i)) role = 'frontier';
      if (i === curIdx) role = 'swap';
      return { value: v, role };
    });
    const aux = [
      {
        label: '栈（下标）',
        value: stack.length ? stack.map((x) => `${x}:a=${arr[x]}`).join(' → ') : '空',
        role: 'frontier' as BarRole,
      },
      { label: '当前 i', value: curIdx >= 0 ? String(curIdx) : '-', role: 'swap' as BarRole },
      {
        label: 'left[]',
        value: `[${left.join(', ')}]`,
        role: 'final' as BarRole,
      },
      {
        label: 'right[]',
        value: `[${right.join(', ')}]`,
        role: 'final' as BarRole,
      },
    ];
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  snapshot({
    zh: `初始数组：[${arr.join(', ')}]，栈为空`,
    en: `Initial array: [${arr.join(', ')}], empty stack`,
  });

  const hooks: MonotonicStackHooks = {
    onPop: (idx, rightIdx, st) => {
      right[idx] = rightIdx;
      stack.length = 0;
      stack.push(...st);
      curIdx = rightIdx;
      snapshot({
        zh: `弹出 a[${idx}]=${arr[idx]} → right[${idx}] = ${rightIdx}`,
        en: `Pop a[${idx}]=${arr[idx]} → right[${idx}] = ${rightIdx}`,
      });
    },
    onPush: (idx, st) => {
      stack.length = 0;
      stack.push(...st);
      curIdx = idx;
      // left[idx] = 弹完后栈的倒数第二个元素（即 idx 下面的栈顶），无则 -1
      left[idx] = st.length >= 2 ? st[st.length - 2]! : -1;
      snapshot({
        zh: `压入 i=${idx}（a=${arr[idx]}），left[${idx}]=${left[idx]}，栈大小=${st.length}`,
        en: `Push i=${idx} (a=${arr[idx]}), left[${idx}]=${left[idx]}, stack size=${st.length}`,
      });
    },
  };

  monotonicStack(arr, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：left=[${left.join(', ')}]，right=[${right.join(', ')}]`,
      en: `Done: left=[${left.join(', ')}], right=[${right.join(', ')}]`,
    })
    .setBars(
      arr.map((v, i) => ({
        value: v,
        role: 'final' as BarRole,
        label: `L=${left[i]} R=${right[i]}`,
      })),
    )
    .setAux([
      { label: 'left[]', value: `[${left.join(', ')}]`, role: 'final' as BarRole },
      { label: 'right[]', value: `[${right.join(', ')}]`, role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
