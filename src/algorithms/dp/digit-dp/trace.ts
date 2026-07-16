// =============================================================================
// 数位 DP · 录制帧序列
// 用 setBars 展示 n 的数位（高位→低位），当前位标 'pivot'；
// 用 setAux 展示状态 (pos, tight, started) 与已填决策。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { digitDp, type DigitDpHooks, type DigitDpInput } from './impl.ts';

/** 演示：统计 [1, 235] 中不含数字 4 的整数个数。 */
export const DEFAULT_INPUT: DigitDpInput = { n: 235, digit: 4 };

/** 录制演示帧序列。 */
export function buildTrace(input: DigitDpInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, digit } = input;
  const digits =
    n <= 0
      ? []
      : String(n)
          .split('')
          .map((c) => Number(c));
  const len = digits.length;

  // 已填到第几位（DFS 栈深度感知）
  let curPos = -1;
  let curTight = -1;
  let curStarted = -1;
  const chosen: number[] = []; // 当前路径上已选的数字（未知位置填 -1）
  for (let i = 0; i < len; i++) chosen.push(-1);
  let examChoice: { pos: number; choice: number } | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    const labels: Record<number, string> = {};
    for (let i = 0; i < len; i++) {
      labels[i] = `${digits[i]}`;
      if (examChoice && examChoice.pos === i) roles[i] = 'pivot';
      else if (i < curPos) roles[i] = 'final';
      else if (i === curPos) roles[i] = 'compare';
    }
    const bars = rec.barsFrom(digits, roles, labels);
    rec
      .begin(note)
      .setBars(bars)
      .setAux([
        { label: '上界 n / upper', value: String(n), role: 'frontier' },
        { label: '禁止数字 / forbidden', value: String(digit), role: 'warn' },
        { label: '当前位 / pos', value: curPos < 0 ? '—' : String(curPos), role: 'compare' },
        {
          label: '贴上界 / tight',
          value: curTight < 0 ? '—' : String(curTight),
          role: curTight === 1 ? 'final' : 'default',
        },
        {
          label: '已开始 / started',
          value: curStarted < 0 ? '—' : String(curStarted),
          role: 'frontier',
        },
        {
          label: '已填 / chosen',
          value: chosen.map((c) => (c < 0 ? '_' : c)).join(' '),
          role: 'default',
        },
      ])
      .commit();
  };

  render({
    zh: `n = ${n}，禁止数字 ${digit}，共 ${len} 位`,
    en: `n = ${n}, forbidden digit ${digit}, ${len} digits`,
  });

  // 通过钩子感知 DFS 深度。由于递归进/出与钩子顺序，我们用一个栈记录 (pos,tight,started)
  const stack: Array<{ pos: number; tight: number; started: number }> = [];

  const hooks: DigitDpHooks = {
    onEnterState: (pos, tight, started) => {
      stack.push({ pos, tight, started });
      curPos = pos;
      curTight = tight;
      curStarted = started;
      render({
        zh: `进入子问题 f(${pos}, tight=${tight}, started=${started})`,
        en: `Enter state f(${pos}, tight=${tight}, started=${started})`,
      });
    },
    onChooseDigit: (pos, choice, valid) => {
      examChoice = { pos, choice };
      chosen[pos] = choice;
      render({
        zh: `位 ${pos}：试填 ${choice}${valid ? `（合法）` : `（含禁数 ${digit}，剪枝）`}`,
        en: `Pos ${pos}: try ${choice}${valid ? ` (ok)` : ` (forbidden ${digit}, prune)`}`,
      });
      examChoice = null;
    },
    onSolve: (pos, tight, started, value) => {
      // 弹栈
      stack.pop();
      chosen[pos] = -1;
      // 恢复上层状态显示
      const top = stack[stack.length - 1];
      if (top) {
        curPos = top.pos;
        curTight = top.tight;
        curStarted = top.started;
      } else {
        curPos = -1;
        curTight = -1;
        curStarted = -1;
      }
      render({
        zh: `f(${pos}, ${tight}, ${started}) = ${value}`,
        en: `f(${pos}, ${tight}, ${started}) = ${value}`,
      });
    },
  };

  const result = digitDp(input, hooks);

  // 终态
  rec
    .begin({
      zh: `[1, ${n}] 中不含 ${digit} 的整数共 ${result} 个`,
      en: `${result} integers in [1, ${n}] avoid digit ${digit}`,
    })
    .setBars(rec.barsFrom(digits, {}, {}))
    .setAux([{ label: '答案 / answer', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
