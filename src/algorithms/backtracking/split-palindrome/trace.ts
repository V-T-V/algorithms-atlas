// =============================================================================
// 分割回文串 II · 录制帧序列
// 可视化：setBars 渲染 dp 数组（各位置最少分割次数）；setAux 展示当前段。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { splitPalindrome, splitPalindromePlan, type SplitPalindromeHooks } from './impl.ts';

export const DEFAULT_INPUT = 'aab';

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;

  rec
    .begin({
      zh: `对 "${input}"（长度 ${n}）求最少回文分割次数`,
      en: `Min palindrome cuts for "${input}" (len ${n})`,
    })
    .setBars(new Array(n).fill(0).map(() => ({ value: 0, role: 'default' as BarRole })))
    .setAux([{ label: '字符串', value: input, role: 'default' }])
    .commit();

  let isPalFrame: boolean[][] = [];
  let curEnd = -1;

  const render = (note: { zh: string; en: string }, final: boolean): void => {
    // 用 isPal 表渲染成网格
    const grid =
      isPalFrame.length > 0
        ? isPalFrame.map((row, i) =>
            row.map((v, j) => ({
              v: v ? '✓' : '',
              role: (i === 0 && j === curEnd
                ? 'pivot'
                : final
                  ? 'final'
                  : ('default' as BarRole)) as BarRole,
            })),
          )
        : [];
    rec
      .begin(note)
      .setGrid(grid)
      .setAux([{ label: '当前段终点', value: curEnd >= 0 ? String(curEnd) : '-', role: 'pivot' }])
      .commit();
  };

  const hooks: SplitPalindromeHooks = {
    onPrecompute: (isPal) => {
      isPalFrame = isPal.map((r) => [...r]);
      render({ zh: `回文表预处理完成`, en: `Palindrome table ready` }, false);
    },
    onTryCut: (start, end, _prev, _nw) => {
      curEnd = end;
      render(
        {
          zh: `尝试段 [${start}..${end}] = "${input.slice(start, end + 1)}"`,
          en: `Try segment [${start}..${end}]`,
        },
        false,
      );
    },
    onUpdate: () => {
      void 0;
    },
    onMemoHit: () => {
      void 0;
    },
  };

  const result = splitPalindrome(input, hooks);
  const plan = splitPalindromePlan(input);

  rec
    .begin({
      zh: `完成：最少分割 ${result} 次，方案：[${plan.map((s) => `"${s}"`).join(', ')}]`,
      en: `Done: min cuts = ${result}, plan: [${plan.map((s) => `"${s}"`).join(', ')}]`,
    })
    .setBars(new Array(n).fill(result).map(() => ({ value: result, role: 'final' as BarRole })))
    .setAux([
      { label: '最少分割次数', value: String(result), role: 'final' },
      { label: '分割方案', value: plan.join(' | '), role: 'final' },
    ])
    .commit();

  return rec.build();
}
