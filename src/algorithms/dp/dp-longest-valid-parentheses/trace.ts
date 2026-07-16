// =============================================================================
// 最长有效括号 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { longestValidParentheses, type LvpHooks } from './impl.ts';

export const DEFAULT_INPUT = '(()())';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const n = input.length;
  const dp: number[] = new Array<number>(n).fill(-1);
  let cur = -1;
  let maxLen = 0;
  let endIdx = -1;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    const labels: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      labels[i] = `${input[i]}\n${dp[i]! < 0 ? '·' : dp[i]}`;
      if (endIdx >= 0 && i >= endIdx - maxLen + 1 && i <= endIdx) roles[i] = 'final';
      else if (i === cur) roles[i] = 'compare';
      else if (dp[i]! > 0) roles[i] = 'frontier';
    }
    const heights = Array.from({ length: n }, (_, i) => (dp[i]! < 0 ? 1 : dp[i]! + 1));
    rec
      .begin(note)
      .setBars(rec.barsFrom(heights, roles, labels))
      .setAux([
        { label: 's', value: input, role: 'frontier' },
        { label: 'dp', value: dp.map((v) => (v < 0 ? '·' : v)).join(' '), role: 'compare' },
        { label: 'maxLen', value: String(maxLen), role: 'final' },
      ])
      .commit();
  };

  snap({ zh: `s = "${input}"`, en: `s = "${input}"` });

  const hooks: LvpHooks = {
    onChar: (i, val) => {
      dp[i] = val;
      cur = i;
      snap({ zh: `dp[${i}] = ${val}`, en: `dp[${i}] = ${val}` });
    },
    onResult: (m, e) => {
      maxLen = m;
      endIdx = e;
      cur = -1;
    },
  };

  longestValidParentheses(input, hooks);

  snap({ zh: `最长有效长度 ${maxLen}`, en: `Longest valid length ${maxLen}` });

  return rec.build();
}
