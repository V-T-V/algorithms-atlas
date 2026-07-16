// =============================================================================
// 快乐数 · 录制帧序列
// 用 aux 展示每一轮的「当前值 → 平方和」序列，并标注是否落入环。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isHappyNumber, type HappyNumberHooks } from './impl.ts';

export const DEFAULT_INPUT = 19; // 经典快乐数：19 → 82 → 68 → 100 → 1

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  /** 已访问过的「当前值」序列（含起点）。 */
  const visited: number[] = [n];
  /** (当前值 → 平方和) 步骤对，用于 aux 展示。 */
  const steps: Array<{ from: number; to: number }> = [];
  let cur = n;
  let verdict: 'happy' | 'unhappy' | null = null;

  const render = (note: { zh: string; en: string }): void => {
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [];
    aux.push({ label: '起点', value: String(n), role: 'frontier' });
    aux.push({ label: '当前', value: String(cur), role: 'pivot' });
    steps.forEach((s, i) => {
      aux.push({
        label: `第 ${i + 1} 步`,
        value: `${s.from} → ${s.to}`,
        role: i === steps.length - 1 ? 'swap' : 'default',
      });
    });
    if (verdict === 'happy') {
      aux.push({ label: '结论', value: '快乐数 ✓', role: 'final' });
    } else if (verdict === 'unhappy') {
      aux.push({ label: '结论', value: '陷入环 ✗', role: 'warn' });
    }
    rec.begin(note).setAux(aux).commit();
  };

  render({
    zh: `判定 n = ${n} 是否为快乐数`,
    en: `Determine whether n = ${n} is a happy number`,
  });

  const hooks: HappyNumberHooks = {
    onStep: (from, to) => {
      steps.push({ from, to });
      visited.push(to);
      cur = to;
      render({
        zh: `${from} → 各位平方和 = ${to}`,
        en: `${from} → sum of squared digits = ${to}`,
      });
    },
    onCycle: (seen) => {
      verdict = 'unhappy';
      cur = seen;
      render({
        zh: `${seen} 重复出现，陷入环 → 不是快乐数`,
        en: `${seen} reappears, cycle detected → not a happy number`,
      });
    },
    onHappy: () => {
      verdict = 'happy';
      cur = 1;
      render({
        zh: `到达 1 → 是快乐数`,
        en: `Reached 1 → happy number`,
      });
    },
  };

  isHappyNumber(n, hooks);

  return rec.build();
}
