// =============================================================================
// 考拉兹猜想 · 录制帧序列
// 用 setBars 展示当前已生成的序列，高亮当前值；用 setAux 显示统计。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { collatzConjecture, type CollatzHooks } from './impl.ts';

export const DEFAULT_INPUT = 27; // 经典示例：112 步，峰值 9232

/** 录制演示帧序列。 */
export function buildTrace(start: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const seq: number[] = [];
  let curIdx = -1;
  let peakIdx = -1;
  let peakValue = -Infinity;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = seq.map((_, i) => {
      if (i === curIdx) return 'swap';
      if (i === seq.length - 1) return 'final';
      return 'sorted';
    });
    if (peakIdx >= 0 && peakIdx < roles.length && roles[peakIdx] === 'sorted') {
      roles[peakIdx] = 'pivot';
    }
    rec
      .begin(note)
      .setBars(seq.map((v, i) => ({ value: v, role: roles[i] ?? 'default' })))
      .setAux([
        { label: '步数', value: String(Math.max(0, seq.length - 1)), role: 'frontier' },
        { label: '当前', value: curIdx >= 0 ? String(seq[curIdx]) : '—', role: 'swap' },
        {
          label: '峰值',
          value: Number.isFinite(peakValue) ? String(peakValue) : '—',
          role: 'pivot',
        },
      ])
      .commit();
  };

  snapshot({
    zh: `起始值 n = ${start}`,
    en: `Start value n = ${start}`,
  });

  const hooks: CollatzHooks = {
    onStep: (n, next) => {
      if (n === next) {
        // 初始帧：n == next 表示把 start 入序列
        seq.push(n);
        curIdx = 0;
        if (n > peakValue) {
          peakValue = n;
          peakIdx = 0;
        }
        snapshot({ zh: `序列起点：${n}`, en: `Sequence start: ${n}` });
      } else {
        seq.push(next);
        curIdx = seq.length - 1;
        if (next > peakValue) {
          peakValue = next;
          peakIdx = curIdx;
        }
        snapshot({
          zh:
            next === 1
              ? `n=${n} → 1（终止）`
              : n % 2 === 0
                ? `${n} 偶 → ${n}/2 = ${next}`
                : `${n} 奇 → 3×${n}+1 = ${next}`,
          en:
            next === 1
              ? `n=${n} → 1 (stop)`
              : n % 2 === 0
                ? `${n} even → ${n}/2 = ${next}`
                : `${n} odd → 3×${n}+1 = ${next}`,
        });
      }
    },
    onEnd: (steps, maxValue) => {
      rec
        .begin({
          zh: `到达 1：共 ${steps} 步，峰值 ${maxValue}`,
          en: `Reached 1: ${steps} steps, peak ${maxValue}`,
        })
        .setBars(seq.map((v) => ({ value: v, role: 'final' as BarRole })))
        .setAux([
          { label: '总步数', value: String(steps), role: 'final' },
          { label: '峰值', value: String(maxValue), role: 'pivot' },
          { label: '起点', value: String(start), role: 'frontier' },
        ])
        .commit();
    },
  };

  collatzConjecture(start, undefined, hooks);

  return rec.build();
}
