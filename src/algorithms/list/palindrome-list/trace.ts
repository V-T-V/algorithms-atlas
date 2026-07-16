// =============================================================================
// 回文链表 · 录制帧序列
// 用 setArray 展示链表值，pointers 标 slow/fast；setAux 展示反转后的后半。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildList, listToArray, palindromeList, type PalindromeListHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 2, 1];

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const head = buildList(input);
  const values = [...input];

  let slowIdx = 0;
  let fastIdx = 0;
  let result: boolean | null = null;
  let reversedHalf: number[] = [];

  const snapshot = (
    note: { zh: string; en: string },
    extra?: { highlightLeft?: number; highlightRight?: number; mid?: number },
  ): void => {
    const roles: BarRole[] = values.map(() => 'default');
    const pointers: Array<{ index: number; label: string }> = [];
    if (extra?.mid !== undefined) {
      // 已反转：标记前半与反转后半的对应比较点
      for (let k = 0; k <= extra.mid; k++) roles[k] = 'sorted';
      if (extra.highlightLeft !== undefined) roles[extra.highlightLeft] = 'compare';
      if (extra.highlightRight !== undefined) roles[extra.highlightRight] = 'swap';
    } else {
      // 快慢指针阶段
      if (slowIdx >= 0 && slowIdx < values.length) {
        roles[slowIdx] = 'pivot';
        pointers.push({ index: slowIdx, label: 'slow' });
      }
      if (fastIdx >= 0 && fastIdx < values.length) {
        if (roles[fastIdx] !== 'pivot') roles[fastIdx] = 'compare';
        pointers.push({ index: fastIdx, label: 'fast' });
      } else if (fastIdx >= values.length) {
        pointers.push({ index: values.length - 1, label: 'fast→null' });
      }
    }
    rec
      .begin(note)
      .setArray(values, roles, pointers)
      .setAux(
        reversedHalf.length
          ? [
              { label: '反转后的后半', value: `[${reversedHalf.join(', ')}]`, role: 'frontier' },
              {
                label: '判定',
                value: result === null ? '比较中…' : result ? '是回文' : '非回文',
                role: result ? 'final' : 'warn',
              },
            ]
          : [{ label: '说明', value: '快指针走到末尾时慢指针恰在中点' }],
      )
      .commit();
  };

  snapshot({ zh: `初始链表：${values.join(' → ')}`, en: `Initial list: ${values.join(' → ')}` });

  const hooks: PalindromeListHooks = {
    onStep: (s, f) => {
      slowIdx = s;
      fastIdx = f;
      snapshot({
        zh: `快慢指针各走一步：slow=${s}, fast=${f}`,
        en: `Step pointers: slow=${s}, fast=${f}`,
      });
    },
    onMidpoint: (idx) => {
      snapshot({
        zh: `慢指针到中点（下标 ${idx}），准备反转后半`,
        en: `Slow at midpoint (idx ${idx}), about to reverse second half`,
      });
    },
    onReversed: (secondHead) => {
      reversedHalf = listToArray(secondHead);
      snapshot({
        zh: `后半反转完成：[${reversedHalf.join(', ')}]`,
        en: `Second half reversed: [${reversedHalf.join(', ')}]`,
      });
    },
    onCompare: (li, ri, equal) => {
      snapshot(
        {
          zh: `比较 a[${li}]=${values[li]} 与 反后半 a[${ri}]=${values[ri]} → ${equal ? '相等' : '不等'}`,
          en: `Compare a[${li}]=${values[li]} vs reversed a[${ri}]=${values[ri]} → ${equal ? 'equal' : 'diff'}`,
        },
        { highlightLeft: li, highlightRight: ri, mid: Math.floor(values.length / 2) - 1 },
      );
    },
    onResult: (isPalin) => {
      result = isPalin;
    },
  };

  palindromeList(head, hooks);

  // 终态
  rec
    .begin({
      zh: result ? '是回文链表' : '不是回文链表',
      en: result ? 'Is a palindrome' : 'Not a palindrome',
    })
    .setArray(
      values,
      values.map(() => 'final' as BarRole),
      [{ index: 0, label: 'head' }],
    )
    .setAux([
      { label: '反转后的后半', value: `[${reversedHalf.join(', ')}]`, role: 'frontier' },
      { label: '判定', value: result ? '是回文' : '非回文', role: result ? 'final' : 'warn' },
    ])
    .commit();

  return rec.build();
}
