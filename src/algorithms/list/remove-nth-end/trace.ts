// =============================================================================
// 删除倒数第 N · 录制帧序列
// 用 setArray 展示链表，pointers 标 fast/slow 双指针（间隔 n）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, removeNthEnd, type RemoveNthEndHooks } from './impl.ts';

export const DEFAULT_INPUT = { values: [1, 2, 3, 4, 5], n: 2 };

/** 录制演示帧序列。 */
export function buildTrace(input: { values: number[]; n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { values, n } = input;
  let display = [...values];
  let slowIdx = -1;
  let fastIdx = -1;

  const snapshot = (
    note: { zh: string; en: string },
    opts: { targetIdx?: number; removed?: boolean } = {},
  ): void => {
    const roles: BarRole[] = display.map(() => 'default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (opts.targetIdx !== undefined && opts.targetIdx >= 0 && opts.targetIdx < display.length) {
      roles[opts.targetIdx] = 'swap';
    }
    if (slowIdx >= 0 && slowIdx < display.length) {
      if (roles[slowIdx] === 'default') roles[slowIdx] = 'pivot';
      pointers.push({ index: slowIdx, label: 'slow' });
    }
    if (fastIdx >= 0 && fastIdx < display.length) {
      if (roles[fastIdx] === 'default') roles[fastIdx] = 'compare';
      pointers.push({ index: fastIdx, label: 'fast' });
    }
    if (opts.removed) {
      // 标记剩余为 final
      for (let k = 0; k < roles.length; k++) roles[k] = 'final';
    }
    rec
      .begin(note)
      .setArray(display, roles, pointers)
      .setAux([
        { label: 'n（倒数第）', value: String(n), role: 'frontier' },
        { label: '间隔', value: `${fastIdx - slowIdx} 步`, role: 'default' },
      ])
      .commit();
  };

  snapshot({ zh: `初始链表：${values.join(' → ')}`, en: `Initial list: ${values.join(' → ')}` });

  const hooks: RemoveNthEndHooks = {
    onFastAdvance: (idx) => {
      fastIdx = idx;
      snapshot({
        zh: `fast 先走：fast=${idx}（建立 n 步间隔）`,
        en: `Fast advances: fast=${idx} (build n-step gap)`,
      });
    },
    onStep: (s, f) => {
      slowIdx = s;
      fastIdx = f;
      snapshot({
        zh: `同步前进：slow=${s}, fast=${f}`,
        en: `Move together: slow=${s}, fast=${f}`,
      });
    },
    onTarget: (s, targetIdx) => {
      slowIdx = s;
      snapshot(
        {
          zh: `定位：待删节点 a[${targetIdx}]=${display[targetIdx]}，前驱 slow=${s}`,
          en: `Located: target a[${targetIdx}]=${display[targetIdx]}, predecessor slow=${s}`,
        },
        { targetIdx },
      );
    },
    onRemoved: (value) => {
      // 从 display 移除被删节点
      const targetIdx = fastIdx + 1 > display.length ? display.length - 1 : -1;
      // 用实际结果重建 display
      // （removeNthEnd 已修改链表，这里直接重拍）
      // 先标记再移除
      snapshot(
        {
          zh: `删除节点（值 ${value}）`,
          en: `Removed node (value ${value})`,
        },
        { targetIdx, removed: false },
      );
    },
  };

  const head = buildList(values);
  const newHead = removeNthEnd(head, n, hooks);
  display = listToArray(newHead);

  // 终态
  rec
    .begin({
      zh: `删除完成：${display.join(' → ')}`,
      en: `Removed; result: ${display.join(' → ')}`,
    })
    .setArray(
      display,
      display.map(() => 'final' as BarRole),
      display.length > 0 ? [{ index: 0, label: 'head' }] : [],
    )
    .setAux([
      { label: 'n（倒数第）', value: String(n), role: 'frontier' },
      { label: '结果长度', value: String(display.length), role: 'final' },
    ])
    .commit();

  return rec.build();
}
