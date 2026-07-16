// =============================================================================
// 单调栈 · 录制帧序列
// 用 setBars 展示原数组，role: 栈中元素='frontier'，当前元素='compare'，
// 刚弹出的='warn'，已确定下一个更大的='final'。pointers 标记栈内容。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nextGreaterElements, type MonotonicStackHooks } from './impl.ts';

export const DEFAULT_INPUT = [2, 1, 4, 3, 5];

/** 录制演示帧序列。 */
export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  const inStack = new Set<number>(); // 栈中的下标
  const resolved = new Set<number>(); // 已找到「下一个更大」的下标
  let current = -1;
  let justPopped = -1;
  // 维护真实栈顺序（自底向顶），便于 aux 显示
  const stackOrder: number[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    inStack.forEach((i) => (roles[i] = 'frontier'));
    resolved.forEach((i) => (roles[i] = 'final'));
    if (justPopped >= 0) roles[justPopped] = 'warn';
    if (current >= 0 && roles[current] === undefined) roles[current] = 'compare';
    const stackDesc = '栈(底→顶): [' + stackOrder.join(', ') + ']';
    rec
      .begin(note)
      .setBars(rec.barsFrom(input, roles))
      .setAux([{ label: '栈', value: stackDesc, role: 'frontier' }])
      .commit();
    current = -1;
    justPopped = -1;
  };

  snapshot({
    zh: `数组：[${input.join(', ')}]，求每个元素右侧第一个更大值`,
    en: `Array: [${input.join(', ')}], find next greater element for each`,
  });

  const hooks: MonotonicStackHooks = {
    onCompare: (i) => {
      current = i;
    },
    onPop: (topIdx, curVal) => {
      inStack.delete(topIdx);
      resolved.add(topIdx);
      justPopped = topIdx;
      current = -1;
      // 同步栈顺序
      const pos = stackOrder.lastIndexOf(topIdx);
      if (pos >= 0) stackOrder.splice(pos, 1);
      snapshot({
        zh: `栈顶 ${topIdx}（值 ${input[topIdx]}）遇到更大值 ${curVal} → 弹出`,
        en: `Stack top ${topIdx} (val ${input[topIdx]}) meets greater ${curVal} → pop`,
      });
    },
    onPush: (i) => {
      inStack.add(i);
      stackOrder.push(i);
      current = i;
      snapshot({
        zh: `压入下标 ${i}（值 ${input[i]}），栈单调递减`,
        en: `Push index ${i} (val ${input[i]}), stack stays decreasing`,
      });
    },
  };

  const { values } = nextGreaterElements(input, hooks);

  // 终态：标记所有元素
  const roles: Record<number, BarRole> = {};
  for (let i = 0; i < input.length; i++) roles[i] = 'final';
  rec
    .begin({
      zh: `完成；下一个更大元素：[${values.join(', ')}]（-1 表示无）`,
      en: `Done; next greater: [${values.join(', ')}] (-1 means none)`,
    })
    .setBars(rec.barsFrom(input, roles))
    .setAux(values.map((v, i) => ({ label: `[${i}]`, value: String(v), role: 'final' })))
    .commit();

  return rec.build();
}
