// =============================================================================
// 数组栈 · 录制帧序列
// 用 setBars 展示缓冲区（实际元素标 'final'，空闲槽标 'default'，
// 栈顶标 'pivot'，扩容瞬间标 'warn'，出栈位置标 'swap'）。
// 用 setAux 展示 size / capacity / top 值。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { StackArray, type StackHooks } from './impl.ts';

/** 演示：依次压栈（含扩容），peek，再逐个弹栈（得到逆序）。 */
export const DEFAULT_INPUT = {
  push: [3, 1, 4, 1, 5, 9, 2], // 第 5 次 push 触发扩容（初始 cap=4）
  pops: 4,
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { push: readonly number[]; pops?: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const st = new StackArray(4);

  let resizing = false;
  let topIdx = -1; // 刚操作的栈顶下标
  let poppedIdx = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const arr = st.toArray(); // 栈底→栈顶
    const cap = st.capacity;
    const size = st.size;
    const vals: number[] = [];
    const roles: Record<number, BarRole> = {};
    for (let i = 0; i < cap; i++) {
      const has = i < size;
      vals.push(has ? arr[i]! : 0);
      if (resizing) roles[i] = 'warn';
      else if (!has) roles[i] = 'default';
      else if (i === poppedIdx) roles[i] = 'swap';
      else if (i === size - 1 || i === topIdx) roles[i] = 'pivot';
      else roles[i] = 'final';
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(vals, roles))
      .setAux([
        { label: 'size', value: String(size), role: 'final' },
        { label: 'capacity', value: String(cap), role: 'compare' },
        { label: 'top', value: size === 0 ? '∅' : String(arr[size - 1]!), role: 'pivot' },
      ])
      .commit();
    resizing = false;
    poppedIdx = -1;
    topIdx = -1;
  };

  snapshot({
    zh: `空栈，初始容量 ${st.capacity}`,
    en: `Empty stack, initial capacity ${st.capacity}`,
  });

  const hooks: StackHooks = {
    onResize: (oldCap, newCap) => {
      resizing = true;
      snapshot({
        zh: `栈满，扩容 ${oldCap} → ${newCap}`,
        en: `Stack full, grow ${oldCap} → ${newCap}`,
      });
    },
    onPush: (sz, value) => {
      topIdx = sz - 1;
      snapshot({
        zh: `push ${value}（栈顶下标 ${sz - 1}）`,
        en: `push ${value} (top index ${sz - 1})`,
      });
    },
    onPop: (sz, value) => {
      poppedIdx = sz;
      snapshot({
        zh: `pop → ${value}（栈顶下移到 ${sz - 1}）`,
        en: `pop → ${value} (top moves to ${sz - 1 >= 0 ? sz - 1 : '∅'})`,
      });
    },
  };

  for (const v of input.push) st.push(v, hooks);

  const popped: number[] = [];
  for (let k = 0; k < (input.pops ?? 0); k++) {
    const v = st.pop(hooks);
    if (v !== undefined) popped.push(v);
  }

  // 终态
  const arr = st.toArray();
  rec
    .begin({
      zh: `完成，栈内 [${arr.join(', ')}]，弹出序列 [${popped.join(', ')}]`,
      en: `Done, stack [${arr.join(', ')}], popped [${popped.join(', ')}]`,
    })
    .setBars(arr.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
