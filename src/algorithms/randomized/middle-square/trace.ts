// =============================================================================
// 平方取中法 · 录制帧序列
// 用 aux 展示每步：种子 → 平方（2n 位补 0）→ 中间 n 位 → 下一个数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { MiddleSquare, type MiddleSquareHooks } from './impl.ts';

export const DEFAULT_INPUT = { seed: 6752, digits: 4, count: 12 };

interface BuildTraceInput {
  seed?: number;
  digits?: number;
  count?: number;
}

/** 录制演示帧序列。 */
export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const seed = input.seed ?? DEFAULT_INPUT.seed;
  const digits = input.digits ?? DEFAULT_INPUT.digits;
  const count = input.count ?? DEFAULT_INPUT.count;

  const rec = new TraceRecorder();
  const gen = new MiddleSquare(seed, digits);
  const seq: number[] = [];

  rec
    .begin({
      zh: `平方取中法：${digits} 位种子 ${seed}，生成至多 ${count} 个数（遇循环/0 停止）`,
      en: `Middle-Square: ${digits}-digit seed ${seed}, generate up to ${count} (stop on cycle/0)`,
    })
    .setAux([
      { label: '种子', value: String(seed), role: 'frontier' as BarRole },
      { label: '位数 n', value: String(digits), role: 'pivot' as BarRole },
      { label: '已生成', value: '0', role: 'default' as BarRole },
    ])
    .commit();

  const hooks: MiddleSquareHooks = {
    onNext: (value, squared, padded) => {
      seq.push(value);
      const n = digits;
      const start = Math.floor(n / 2);
      const midPart = padded.substring(start, start + n);
      // 高亮中间位
      const before = padded.substring(0, start);
      const after = padded.substring(start + n);
      rec
        .begin({
          zh: `${seq.length}. ${value === 0 ? '→ 收敛到 0' : `${padded.substring(0, start)}[${midPart}]${after} = ${value}`}`,
          en: `${seq.length}. ${value === 0 ? '→ converged to 0' : `${before}[${midPart}]${after} = ${value}`}`,
        })
        .setAux([
          { label: '前一个数', value: String(Math.sqrt(squared) | 0), role: 'compare' as BarRole },
          { label: '平方', value: String(squared), role: 'pivot' as BarRole },
          { label: '平方(补0)', value: padded, role: 'default' as BarRole },
          { label: '中间 n 位', value: midPart, role: 'swap' as BarRole },
          { label: '下一个数', value: String(value), role: 'final' as BarRole },
          { label: '已生成', value: String(seq.length), role: 'default' as BarRole },
        ])
        .commit();
    },
    onCycle: (value) => {
      rec
        .begin({
          zh: value === 0 ? `收敛到 0，序列终止` : `检测到循环（值 ${value} 重复），停止`,
          en:
            value === 0
              ? `Converged to 0, sequence ends`
              : `Cycle detected (value ${value} repeats), stop`,
        })
        .setAux([
          {
            label: '终止原因',
            value: value === 0 ? '收敛到 0' : `循环(${value})`,
            role: 'warn' as BarRole,
          },
          { label: '已生成', value: String(seq.length), role: 'default' as BarRole },
        ])
        .commit();
    },
  };

  gen.generate(count, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：生成 ${seq.length} 个数`,
      en: `Done: generated ${seq.length} numbers`,
    })
    .setAux([
      { label: '序列长度', value: String(seq.length), role: 'final' as BarRole },
      { label: '序列', value: seq.join(' → '), role: 'default' as BarRole },
    ])
    .commit();

  return rec.build();
}

export { MiddleSquare };
