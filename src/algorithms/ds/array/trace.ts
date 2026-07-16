// =============================================================================
// 动态数组 · 录制帧序列
// 用 setBars 展示缓冲区（实际元素标 'final'，空闲槽标 'default'，
// 当前操作位标 'compare'/'swap'，扩容瞬间标 'pivot'）。
// 用 setAux 展示 size 与 capacity。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { DynamicArray, type ArrayHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  push: [1, 2, 3, 4, 5, 6, 7], // 第 5 次 push 触发扩容（初始 cap=4）
  insert: { index: 2, value: 99 },
  remove: 0,
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    push: readonly number[];
    insert?: { index: number; value: number };
    remove?: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const da = new DynamicArray(4);

  let hotIdx = -1;
  let resizing = false;
  let swapIdx = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const arr = da.toArray();
    const cap = da.capacity;
    const size = da.size;
    // 用 capacity 长度的 bars：实际元素用其值，空闲槽用 0（视觉上更短）
    const vals: number[] = [];
    const roles: Record<number, BarRole> = {};
    for (let i = 0; i < cap; i++) {
      const has = i < size;
      vals.push(has ? arr[i]! : 0);
      if (resizing) roles[i] = 'pivot';
      else if (!has) roles[i] = 'default';
      else if (i === swapIdx) roles[i] = 'swap';
      else if (i === hotIdx) roles[i] = 'compare';
      else roles[i] = 'final';
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(vals, roles))
      .setAux([
        { label: 'size', value: String(size), role: 'final' },
        { label: 'capacity', value: String(cap), role: 'compare' },
      ])
      .commit();
    resizing = false;
    swapIdx = -1;
  };

  snapshot({
    zh: `空数组，初始容量 ${da.capacity}`,
    en: `Empty array, initial capacity ${da.capacity}`,
  });

  const hooks: ArrayHooks = {
    onResize: (oldCap, newCap) => {
      resizing = true;
      snapshot({
        zh: `容量满，扩容 ${oldCap} → ${newCap}`,
        en: `Full, grow ${oldCap} → ${newCap}`,
      });
    },
    onPush: (index) => {
      hotIdx = index;
      snapshot({ zh: `push 到下标 ${index}`, en: `push at index ${index}` });
      hotIdx = -1;
    },
    onInsert: (index) => {
      hotIdx = index;
      swapIdx = -1;
      snapshot({ zh: `在 ${index} 插入（后续后移）`, en: `Insert at ${index} (shift right)` });
      hotIdx = -1;
    },
    onRemove: (index) => {
      hotIdx = index;
      swapIdx = index + 1;
      snapshot({ zh: `删除下标 ${index}（后续前移）`, en: `Remove index ${index} (shift left)` });
      hotIdx = -1;
    },
  };

  for (const v of input.push) da.push(v, hooks);
  if (input.insert) da.insert(input.insert.index, input.insert.value, hooks);
  if (input.remove !== undefined) da.remove(input.remove, hooks);

  rec
    .begin({
      zh: `完成，数组 [${da.toArray().join(', ')}]，size=${da.size} cap=${da.capacity}`,
      en: `Done, array [${da.toArray().join(', ')}], size=${da.size} cap=${da.capacity}`,
    })
    .setBars(da.toArray().map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
