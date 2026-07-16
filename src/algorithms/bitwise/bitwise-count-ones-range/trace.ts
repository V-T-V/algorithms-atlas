// =============================================================================
// 区间内 1 的个数 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countSetBitsRange, type CountOnesRangeHooks } from './impl.ts';

export const DEFAULT_LO = 0;
export const DEFAULT_HI = 15;

/** 录制演示帧序列。 */
export function buildTrace(lo: number = DEFAULT_LO, hi: number = DEFAULT_HI): Frame[] {
  const rec = new TraceRecorder();
  const values: number[] = [];
  for (let v = lo; v <= hi; v++) values.push(v);

  // 可视化：用每个数的 popcount 作为柱高，逐数展示
  const pop = (n: number): number => {
    let c = 0;
    let x = n;
    while (x > 0) {
      x -= x & -x;
      c++;
    }
    return c;
  };

  rec
    .begin({
      zh: `统计 [${lo}, ${hi}] 中所有数的 1 的总个数（柱高=各数 popcount）`,
      en: `Count set bits over [${lo}, ${hi}]`,
    })
    .setBars(values.map((v) => ({ value: pop(v), role: 'frontier' as BarRole, label: String(v) })))
    .commit();

  const hooks: CountOnesRangeHooks = {
    onBit: (bit, contribution) => {
      rec
        .begin({
          zh: `第 ${bit} 位为 1，贡献 ${contribution}`,
          en: `Bit ${bit}=1, contributes ${contribution}`,
        })
        .setAux([{ label: `位 ${bit} 贡献`, value: String(contribution), role: 'pivot' }])
        .commit();
    },
    onPrefix: (n, value) => {
      rec
        .begin({ zh: `前缀 S(${n}) = ${value}`, en: `S(${n}) = ${value}` })
        .setAux([{ label: `S(${n})`, value: String(value), role: 'frontier' }])
        .commit();
    },
    onDone: (count) => {
      rec
        .begin({
          zh: `[${lo}, ${hi}] 共有 ${count} 个 1`,
          en: `${count} set bits in [${lo}, ${hi}]`,
        })
        .setBars(values.map((v) => ({ value: pop(v), role: 'final' as BarRole, label: String(v) })))
        .setAux([{ label: '总数', value: String(count), role: 'final' }])
        .commit();
    },
  };

  countSetBitsRange(lo, hi, hooks);

  return rec.build();
}
